"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/db";
import { auth } from "@/app/(root)/user/(auth)/auth";
import { isAdmin } from "@/features/role-check";

export async function POST(req: NextRequest) {
	try {
		if (await isAdmin()) {
			const body = await req.json();

			// Check if this is a question creation request (has questionName property)
			if (body.questionName) {
				// Create a new question
				const { questionName } = body;
				const session = await auth();
				const autorSessionId = session?.user.id;
				const questionData = {
					title: questionName,
					authorId: autorSessionId,
				};

				const response = await prisma.question.create({
					data: questionData,
				});

				return NextResponse.json(
					{ success: true, data: response },
					{ status: 200 },
				);
			} else {
				// This is a question fetch request
				const { data, inputType, pagination = {} } = body;

				// Default pagination values
				const page = pagination?.page || 1;
				const limit = pagination?.limit || 10;
				const skip = (page - 1) * limit;

				// Get total count for pagination
				const totalCount = await prisma.question.count();

				// Get paginated results
				const questions = await prisma.question.findMany({
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
		} else {
			return NextResponse.json({ error: "No access" }, { status: 403 });
		}
	} catch (error) {
		console.error("Questions operation error:", error);
		return NextResponse.json(
			{ error: "Invalid request", detail: (error as Error).message },
			{ status: 400 },
		);
	}
}
