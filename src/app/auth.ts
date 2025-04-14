import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Bcrypt from "@/shared/lib/bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter"
import {prisma} from "@/shared/lib/db";

export const {handlers, auth, signIn, signOut} = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                try {

                    const user = await prisma.user.findUnique({where: {email: credentials.email as string}})

                    if (!user) {
                        const err = new Error("User not found")
                        err.name = "CredentialsSignin"
                        throw err
                    }

                    const isPasswordValid = await Bcrypt.compare(credentials.password as string, user.password as string)
                    if (!isPasswordValid) {
                        const err = new Error("Invalid password")
                        err.name = "CredentialsSignin"
                        throw err
                    }

                    return user
                } catch (error: any) {
                    const err = new Error(error.message || "Invalid login")
                    err.name = "CallbackRouteError" // ← this tells NextAuth to handle it properly
                    throw err
                }
            }

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