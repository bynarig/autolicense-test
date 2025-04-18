import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Bcrypt from "@/shared/lib/bcrypt";
import {PrismaAdapter} from "@auth/prisma-adapter"
import {prisma} from "@/shared/lib/db";

export const {handlers, auth, signIn, signOut} = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"},
            },
            authorize: async (credentials) => {

                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {email: credentials.email as string}
                });
                console.log(user)

                if (!user || !user.password) {
                    return null;
                }

                const isPasswordValid = await Bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("password does not match")
                }

                return user;
            }
        }),
    ],
    pages: {
        signIn: "/user/login",
    },
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({session, token}) {
            if (token?.id) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    trustHost: true,

});