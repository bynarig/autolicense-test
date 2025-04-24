"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/db";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const pagination = body?.pagination || {};

		// Default pagination values
		const page = pagination?.page || 1;
		const limit = pagination?.limit || 10;
		const skip = (page - 1) * limit;

		// Use Prisma transaction to execute both queries in a single database round trip
		const [totalCount, users] = await prisma.$transaction([
			prisma.user.count(),
			prisma.user.findMany({
				skip,
				take: limit,
				orderBy: {
					createdAt: "desc", // Most recent users first
				},
			}),
		]);

		return NextResponse.json(
			{
				success: true,
				data: users,
				totalCount,
				pagination: {
					page,
					limit,
					totalPages: Math.ceil(totalCount / limit),
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Users fetch error:", error);
		return NextResponse.json(
			{ error: "Invalid request", detail: (error as Error).message },
			{ status: 400 },
		);
	}
}
