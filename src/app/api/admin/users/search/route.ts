"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/db";

export async function POST(req: NextRequest) {
	try {
		const { input, inputType } = await req.json();

		let response = undefined;
		switch (inputType) {
			case "email":
				response = await prisma.user.findMany({
					where: { email: input as string },
				});
				break;
			case "name":
				response = await prisma.user.findMany({
					where: { name: input as string },
				});
				break;
			case "id":
				response = await prisma.user.findMany({
					where: { id: input as string },
				});
				break;
			case "role":
				response = await prisma.user.findMany({
					where: { role: input.toUpperCase() as any },
				});
				break;
			default:
				return NextResponse.json(
					{ error: "Invalid inputType" },
					{ status: 400 },
				);
		}

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
