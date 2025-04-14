import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import {prisma} from "@/shared/lib/db";
import Bcrypt from "@/shared/lib/bcrypt";


export const {handlers, auth, signIn, signOut} = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {

                const MockUser = {email: "test@test.com", password: "password", name: "test"};

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials?.email as string,
                    },
                });
                if (user) {
                    const IsPasswordIdentical = await Bcrypt.compare(credentials.password as string, user.password as string);
                    if (IsPasswordIdentical) {
                        return user
                    }



                } return MockUser as any;
            },
        }),
    ],
    pages: {
        signIn: "/user/login"
    },
    session: {
        strategy: "jwt"
    },
    trustHost: true
})