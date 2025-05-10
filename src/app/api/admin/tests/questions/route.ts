"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@server/config/auth-js";
import { UserMiddleware } from "@server/middleware/user.middleware";
import { QuestionsService } from "@server/services/questions.service";
import { QuestionsController } from "@server/controllers/admin/questions.controller";

const questionsService = new QuestionsService();
const questionsController = new QuestionsController(questionsService);

export async function GET(req: NextRequest) {
	const middlewareCheck = await UserMiddleware.RequireAdmin(req);
	if (middlewareCheck) return middlewareCheck;

	return questionsController.getQuestions(req);

	// This is a question fetch request
	// const pagination = {};
	// // Default pagination values
	// ////const page = pagination?.page || 1;
	const page = 1;
	// //const limit = pagination?.limit || 50;
	const limit = 50;
	// const skip = (page - 1) * limit;
	//
	// // Get total count for pagination
	// const totalCount = await prisma.question.count();
	//
	// // Get paginated results
	// const questions = await prisma.question.findMany({
	// 	skip,
	// 	take: limit,
	// 	orderBy: {
	// 		id: "desc", // Most recent questions first (using id which contains timestamp in MongoDB)
	// 	},
	// 	include: {
	// 		author: {
	// 			select: {
	// 				name: true,
	// 				id: true,
	// 			},
	// 		},
	// 	},
	// });
	//
	// return NextResponse.json(
	// 	{
	// 		success: true,
	// 		data: questions,
	// 		totalCount,
	// 		pagination: {
	// 			page,
	// 			limit,
	// 			totalPages: Math.ceil(totalCount / limit),
	// 		},
	// 	},
	// 	{ status: 200 },
	// );
}

export async function POST(req: NextRequest) {
	const middlewareCheck = await UserMiddleware.RequireAdmin(req);
	if (middlewareCheck) return middlewareCheck;
	const body = await req.json();

	// Check if this is a question creation request (has questionName property)
	// Create a new question
	const { questionName, imagePath } = body;
	const session = await auth();
	const autorSessionId = session?.user.id;
	const questionData = {
		title: questionName,
		authorId: autorSessionId,
		imageUrl: imagePath || null,
	};

	const response = await prisma.question.create({
		data: questionData,
	});

	return NextResponse.json(
		{ success: true, data: response },
		{ status: 200 },
	);
}
