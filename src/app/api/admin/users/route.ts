"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/db";

export async function POST(req: NextRequest) {
	try {
		// const {input, inputType} = await req.json()

		const response = await prisma.user.findMany({});

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
