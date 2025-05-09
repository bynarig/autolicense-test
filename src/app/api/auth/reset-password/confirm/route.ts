"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Bcrypt from "@/lib/bcrypt";

export async function POST(req: NextRequest) {
	try {
		const { token, password } = await req.json();

		if (!token || !password) {
			return NextResponse.json(
				{ error: "Token and password are required" },
				{ status: 400 },
			);
		}

		// Find user with the provided token
		const user = await prisma.user.findFirst({
			where: {
				resetToken: token,
				resetTokenExpiry: {
					gt: new Date(), // Token must not be expired
				},
			},
		});

		if (!user) {
			return NextResponse.json(
				{ error: "Invalid or expired token" },
				{ status: 400 },
			);
		}

		// Hash the new password
		const hashedPassword = await Bcrypt.hash(password);

		// Update the user's password and clear the reset token
		await prisma.user.update({
			where: { id: user.id },
			data: {
				password: hashedPassword,
				resetToken: null,
				resetTokenExpiry: null,
			},
		});

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error("Password reset confirmation error:", error);
		return NextResponse.json(
			{
				error: "Failed to reset password",
				detail: (error as Error).message,
			},
			{ status: 500 },
		);
	}
}
