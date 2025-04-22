"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/db";
import { isAdmin } from "@/features/role-check";
import { auth } from "@/app/(root)/user/(auth)/auth";
import Bcrypt from "@/shared/lib/bcrypt";

type tParams = Promise<{ id: string }>;

// Corrected GET function signature
export async function GET(req: Request, { params }: { params: tParams }) {
	try {
		if (!(await isAdmin())) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		const { id }: { id: string } = await params;
		// Removed await from params destructuring
		// const { id } = await params;

		if (!id) {
			return NextResponse.json(
				{ error: "Test ID is required" },
				{ status: 400 },
			);
		}

		const test = await prisma.user.findUnique({
			where: { id: id },
		});

		if (!test) {
			return NextResponse.json(
				{ error: "Test not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{ success: true, data: test },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error fetching test:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				detail:
					error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

export async function DELETE(req: Request, { params }: { params: tParams }) {
	try {
		if (await isAdmin()) {
			const session = await auth();
			const { id }: { id: string } = await params;
			if (session?.user.id !== id) {
				const response = await prisma.user.delete({
					where: {
						id: id,
					},
				});
				return NextResponse.json(
					{ success: true, data: response },
					{ status: 200 },
				);
			} else {
				return NextResponse.json(
					{ error: "Cannot delete yourself" },
					{ status: 403 },
				);
			}
		} else {
			return NextResponse.json({ error: "No access" }, { status: 403 });
		}
	} catch (error) {
		return NextResponse.json(
			{ error: "Invalid request", detail: (error as Error).message },
			{ status: 400 },
		);
	}
}

export async function POST(req: Request, { params }: { params: tParams }) {
	try {
		if (await isAdmin()) {
			const {
				email,
				subscriptionExpiresAt,
				role,
				name,
				username,
				// avatarUrl,
			} = await req.json();

			// Create a data object without the password
			const updateData = {
				email,
				subscriptionExpiresAt,
				role,
				name,
				username,
				// avatarUrl,
			};

			// Only add password to the update if it's provided
			// if (password && password.trim() !== "") {
			// 	updateData.password = await Bcrypt.hash(password);
			// }

			const { id } = await params;
			const response = await prisma.user.update({
				where: {
					id: id,
				},
				data: updateData,
			});
			return NextResponse.json(
				{ success: true, data: response },
				{ status: 200 },
			);
		} else {
			return NextResponse.json({ error: "No access" }, { status: 403 });
		}
	} catch (error) {
		return NextResponse.json(
			{ error: "Invalid request", detail: (error as Error).message },
			{ status: 400 },
		);
	}
}
