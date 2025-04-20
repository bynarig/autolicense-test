"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/db";
import { auth } from "@/app/(root)/user/(auth)/auth";

export async function GET(req: NextRequest) {
	try {
		// const {input, inputType} = await req.json()

		const response = await prisma.test.findMany({
			include: {
				author: {
					select: {
						name: true,
					},
				},
			},
		});

		return NextResponse.json(
			{ success: true, data: response },
			{ status: 200 },
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Invalid request", detail: (error as Error).message },
			{ status: 400 },
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const { testName } = await req.json();
		const session = await auth();
		const autorSessionId = session?.user.id;

		const testData = {
			title: testName,
			authorId: autorSessionId,
		};
		const response = await prisma.test.create({
			data: testData,
		});

		return NextResponse.json(
			{ success: true, data: response },
			{ status: 200 },
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Invalid request", detail: (error as Error).message },
			{ status: 400 },
		);
	}
}
