"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/split/server/services/role-check";
import { auth } from "@/app/(root)/user/(auth)/auth";

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

		const test = await prisma.test.findUnique({
			where: { id: id },
			include: {
				author: {
					select: {
						name: true,
						id: true,
					},
				},
			},
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
			// Removed await from params destructuring
			const { id }: { id: string } = await params;
			// const session = await auth();
			// const autorSessionId = session?.user.id;

			const response = await prisma.test.delete({
				where: {
					id: id,
				},
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
