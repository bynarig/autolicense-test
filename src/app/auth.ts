import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import {PrismaAdapter} from "@auth/prisma-adapter"
import {prisma} from "@/shared/lib/db"


export const {handlers, auth, signIn, signOut} = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {

                let user = {email: "test@test.com", password: "password", name: "test"};

                if (credentials?.password == user.password && credentials?.password == user.password) {
                    return user
                } else return null
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