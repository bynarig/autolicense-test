"use server"
import { signIn } from "@/app/auth"
import { prisma } from "@/shared/lib/db"
import { Prisma } from "@prisma/client"
import Bcrypt from "@/shared/lib/bcrypt"

export async function signup({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}) {
  const hashedPassword = await Bcrypt.hash(password)

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (!existingUser) {
    const userData: Prisma.UserCreateInput = {
      email,
      name,
      password: hashedPassword,
    }

    await prisma.user.create({
      data: userData,
    })
  }

  await signIn("credentials", { email, password })
}