"use server";

import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/app/(root)/user/(auth)/auth";
import { prisma } from "@/shared/lib/db";
import Bcrypt from "@/shared/lib/bcrypt";

export async function POST(req: NextRequest) {
	try {
		const { email, password } = await req.json();

		const user = await prisma.user.findUnique({
			where: { email: email as string },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 401 },
			);
		}
		if (!user.password) {
			return NextResponse.json(
				{ error: "User dont have password" },
				{ status: 401 },
			);
		}

		// Add password verification here
		const isValid = await Bcrypt.compare(password as string, user.password);
		if (!isValid) {
			return NextResponse.json(
				{ error: "Invalid password" },
				{ status: 401 },
			);
		}
		const result = await signIn("credentials", {
			email,
			password,
			redirect: false,
		});

		if (result?.error) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 },
			);
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Invalid request", detail: (error as Error).message },
			{ status: 400 },
		);
	}
}
