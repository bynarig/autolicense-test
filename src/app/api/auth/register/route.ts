"use server"
import {signIn} from "@/app/(root)/user/(auth)/auth"
import {prisma} from "@/shared/lib/db"
import {Prisma} from "@prisma/client"
import Bcrypt from "@/shared/lib/bcrypt"
import {NextRequest, NextResponse} from "next/server";


export async function POST(req: NextRequest) {
    try {
        const {email, password} = await req.json();

        const DbUser = await prisma.user.findUnique({
            where: {email},
        });

        const hashedPassword = await Bcrypt.hash(password)

        if (!DbUser) {
            const userData: Prisma.UserCreateInput = {
                email,
                password: hashedPassword,
            }

            await prisma.user.create({
                data: userData,
            })
        } else {
             return NextResponse.json(
                {error: "User already exists"},
                {status: 401}
            );
        }

        try {
            await signIn("credentials", {email, password});
        } catch (err) {
            return NextResponse.json(
                {error: "Authentication failed"},
                {status: 500}
            );
        }

        return NextResponse.json(
            {success: true, message: "Register successful"},
            {status: 200}
        );
    } catch (error) {
        return NextResponse.json(
            {error: "Invalid request", detail: (error as Error).message},
            {status: 400}
        );
    }
}
//
// export async function signup({
//                                  name,
//                                  email,
//                                  password,
//                              }: {
//     name: string
//     email: string
//     password: string
// }) {
//     const hashedPassword = await Bcrypt.hash(password)
//
//     const existingUser = await prisma.user.findUnique({
//         where: {email},
//     })
//
//     if (!existingUser) {
//         const userData: Prisma.UserCreateInput = {
//             email,
//             name,
//             password: hashedPassword,
//         }
//
//         await prisma.user.create({
//             data: userData,
//         })
//     }
//
//     await signIn("credentials", {email, password})
// }