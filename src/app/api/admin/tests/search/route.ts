"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/role-check";

export async function POST(req: NextRequest) {
	try {
		if (await isAdmin()) {
			const { data, inputType, pagination } = await req.json();
			const input = data?.search || "";

			// Default pagination values
			const page = pagination?.page || 1;
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
			const totalCount = await prisma.test.count({
				where: whereClause,
			});

			// Get paginated results
			const tests = await prisma.test.findMany({
				where: whereClause,
				skip,
				take: limit,
				orderBy: {
					createdAt: "desc", // Most recent tests first
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
					data: tests,
					totalCount,
					pagination: {
						page,
						limit,
						totalPages: Math.ceil(totalCount / limit),
					},
				},
				{ status: 200 },
			);
		} else {
			return NextResponse.json({ error: "No access" }, { status: 403 });
		}
	} catch (error) {
		console.error("Search error:", error);
		return NextResponse.json(
			{ error: "Invalid request", detail: (error as Error).message },
			{ status: 400 },
		);
	}
}
