"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/db";
import { isAdmin } from "@/features/role-check";

type tParams = Promise<{ id: string }>;

export async function GET(req: Request, { params }: { params: tParams }) {
	try {
		if (!(await isAdmin())) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { id }: { id: string } = await params;

		if (!id) {
			return NextResponse.json(
				{ error: "Question ID is required" },
				{ status: 400 },
			);
		}

		const test = await prisma.question.findUnique({
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
				{ error: "Question not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{ success: true, data: test },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error fetching Question:", error);
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
			const { id }: { id: string } = await params;

			// const session = await auth();
			// const autorSessionId = session?.user.id;

			const response = await prisma.question.delete({
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
