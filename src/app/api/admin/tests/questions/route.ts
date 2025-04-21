"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/db";
import { auth } from "@/app/(root)/user/(auth)/auth";
import { isAdmin } from "@/features/role-check";

export async function GET() {
	try {
		if (await isAdmin()) {
			const response = await prisma.question.findMany({
				include: {
					author: {
						select: {
							name: true,
							id: true,
						},
					},
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

export async function POST(req: NextRequest) {
	try {
		if (await isAdmin()) {
			const { questionName } = await req.json();
			const session = await auth();
			const autorSessionId = session?.user.id;
			const testData = {
				title: questionName,
				authorId: autorSessionId,
			};

			const response = await prisma.question.create({
				data: testData,
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
