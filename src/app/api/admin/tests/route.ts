"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/db";
import { auth } from "@/app/(root)/user/(auth)/auth";
import { isAdmin } from "@/features/role-check";

export async function POST(req: NextRequest) {
	try {
		if (await isAdmin()) {
			const body = await req.json();

			// Check if this is a test creation request (has testName property)
			if (body.testName) {
				// Create a new test
				const { testName } = body;
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
			} else {
				// This is a test fetch request
				const pagination = body?.pagination || {};

				// Default pagination values
				const page = pagination?.page || 1;
				const limit = pagination?.limit || 10;
				const skip = (page - 1) * limit;

				// Get total count for pagination
				const totalCount = await prisma.test.count();

				// Get paginated results
				const tests = await prisma.test.findMany({
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
			}
		} else {
			return NextResponse.json({ error: "No access" }, { status: 403 });
		}
	} catch (error) {
		console.error("Tests operation error:", error);
		return NextResponse.json(
			{ error: "Invalid request", detail: (error as Error).message },
			{ status: 400 },
		);
	}
}
