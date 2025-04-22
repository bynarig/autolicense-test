"use server";

import { signIn } from "@/app/(root)/user/(auth)/auth";
import { prisma } from "@/shared/lib/db";
import { Prisma } from "@prisma/client";
import Bcrypt from "@/shared/lib/bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { email, password } = await req.json();

		const DbUser = await prisma.user.findUnique({
			where: { email },
		});

		const hashedPassword = await Bcrypt.hash(password);

		if (!DbUser) {
			const userData: Prisma.UserCreateInput = {
				email,
				password: hashedPassword,
				name: email.split("@")[0],
			};

			await prisma.user.create({
				data: userData,
			});
		} else {
			return NextResponse.json(
				{ error: "User already exists" },
				{ status: 401 },
			);
		}

		try {
			await signIn("credentials", { email, password });
		} catch (err) {
			return NextResponse.json({ success: true }, { status: 200 });
		}
	} catch (error) {
		return NextResponse.json(
			{ error: "Invalid request", detail: (error as Error).message },
			{ status: 400 },
		);
	}
}
