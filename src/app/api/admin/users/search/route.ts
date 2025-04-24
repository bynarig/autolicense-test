"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/db";

export async function POST(req: NextRequest) {
	try {
		const { data, inputType, pagination } = await req.json();
		const input = data?.search || "";

		// Default pagination values
		const page = pagination?.page || 1;
		const limit = pagination?.limit || 10;
		const skip = (page - 1) * limit;

		// Build the where clause based on input type
		let whereClause: any = {};
		switch (inputType) {
			case "email":
				whereClause = {
					email: {
						contains: input,
						mode: "insensitive", // Case-insensitive search
					},
				};
				break;
			case "name":
				whereClause = {
					name: {
						contains: input,
						mode: "insensitive", // Case-insensitive search
					},
				};
				break;
			case "id":
				// For ID, we still use exact match
				whereClause = { id: input };
				break;
			case "role":
				whereClause = {
					role: {
						equals: input.toUpperCase() as any,
					},
				};
				break;
			default:
				// If input type is not specified or invalid, search across multiple fields
				whereClause = {
					OR: [
						{ name: { contains: input, mode: "insensitive" } },
						{ email: { contains: input, mode: "insensitive" } },
						{ id: input.length === 24 ? input : undefined },
					],
				};
		}

		// Get total count for pagination
		const totalCount = await prisma.user.count({
			where: whereClause,
		});

		// Get paginated results
		const users = await prisma.user.findMany({
			where: whereClause,
			skip,
			take: limit,
			orderBy: {
				createdAt: "desc", // Most recent users first
			},
		});

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
		console.error("Search error:", error);
		return NextResponse.json(
			{ error: "Invalid request", detail: (error as Error).message },
			{ status: 400 },
		);
	}
}
