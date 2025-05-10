"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UserMiddleware } from "@server/middleware/user.middleware";

export async function GET(req: NextRequest) {
	const middlewareCheck = await UserMiddleware.RequireAdmin(req);
	if (middlewareCheck) return middlewareCheck;

	// const body = await req.json();
	const pagination = {};

	// Default pagination values
	//const page = pagination?.page || 1;
	const page = 1;
	//const limit = pagination?.limit || 50;
	const limit = 50;
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
}
