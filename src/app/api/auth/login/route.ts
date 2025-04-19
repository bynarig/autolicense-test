"use server";

import { NextRequest, NextResponse } from "next/server";
import Bcrypt from "@/shared/lib/bcrypt";
import { prisma } from "@/shared/lib/db";
import { signIn } from "@/app/(root)/user/(auth)/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Find user by email
    const DbUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!DbUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Compare passwords
    const validPassword = await Bcrypt.compare(password, DbUser.password || "");
    if (!validPassword) {
      return NextResponse.json(
        { error: "Wrong password" },
        { status: 401 }
      );
    }

    // Attempt to sign in
    try {
      await signIn("credentials", { email, password }); // Optional, depending on your auth implementation
    } catch (err) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Login successful" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request", detail: (error as Error).message },
      { status: 400 }
    );
  }
}