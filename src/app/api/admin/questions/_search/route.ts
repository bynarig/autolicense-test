"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UserMiddleware } from "@server/middleware/user.middleware";

export async function POST(req: NextRequest) {
	const middlewareCheck = await UserMiddleware.RequireAdmin(req);
	if (middlewareCheck) return middlewareCheck;

	const { data, inputType, pagination } = await req.json();
	const input = data?.search || "";

	// Default pagination values
	//const page = pagination?.page || 1;
	const page = 1;
	const limit = pagination?.limit || 10;
	const skip = (page - 1) * limit;

	// Build the where clause based on input type
	let whereClause: any = {};
	switch (inputType) {
		case "name":
			whereClause = {
				title: {
					contains: input,
					mode: "insensitive", // Case-insensitive search
				},
			};
			break;
		case "id":
			// For ID, we still use exact match
			whereClause = { id: input };
			break;
		default:
			// If input type is not specified or invalid, search across multiple fields
			whereClause = {
				OR: [
					{ title: { contains: input, mode: "insensitive" } },
					{ id: input.length === 24 ? input : undefined },
				],
			};
	}

	// Get total count for pagination
	const totalCount = await prisma.question.count({
		where: whereClause,
	});

	// Get paginated results
	const questions = await prisma.question.findMany({
		where: whereClause,
		skip,
		take: limit,
		orderBy: {
			id: "desc", // Most recent questions first (using id which contains timestamp in MongoDB)
		},
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
		{
			success: true,
			data: questions,
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
