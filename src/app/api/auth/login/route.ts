"use server";

import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@server/config/auth-js";
import { prisma } from "@/lib/db";
import Bcrypt from "@/lib/bcrypt";
import { ApiResponse } from "@server/utils/apiResponse";

export async function POST(req: NextRequest) {
	try {
		const { email, password } = await req.json();

		const userDB = await prisma.user.findUnique({
			where: { email: email as string },
		});

		if (!userDB) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 401 },
			);
		}
		if (!userDB.password) {
			return NextResponse.json(
				{ error: "User dont have password" },
				{ status: 401 },
			);
		}

		// Add password verification here
		const isValid = await Bcrypt.compare(
			password as string,
			userDB.password,
		);
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
		const user = await prisma.user.findUnique({
			where: { email: email as string },
			// select: {
			// 	id: true,
			// 	name: true,
			// 	username: true,
			// 	email: true,
			// 	role: true,
			// 	avatarUrl: true,
			// },
		});

		if (result?.error) {
			return ApiResponse.success({ user });
		}

		return NextResponse.json({ user }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Invalid request", detail: (error as Error).message },
			{ status: 400 },
		);
	}
}
