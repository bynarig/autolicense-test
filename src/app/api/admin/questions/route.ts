"use server";

import { NextRequest } from "next/server";
import { UserMiddleware } from "@server/middleware/user.middleware";
import { QuestionsService } from "@server/services/questions.service";
import { QuestionsController } from "@server/controllers/admin/questions.controller";

const questionsService = new QuestionsService();
const questionsController = new QuestionsController(questionsService);

export async function GET(req: NextRequest) {
	const middlewareCheck = await UserMiddleware.RequireAdmin(req);
	if (middlewareCheck) return middlewareCheck;

	return questionsController.getQuestions(req);
}

export async function POST(req: NextRequest) {
	const middlewareCheck = await UserMiddleware.RequireAdmin(req);
	if (middlewareCheck) return middlewareCheck;
	return questionsController.createQuestion(req);
	// const body = await req.json();
	//
	// // Check if this is a question creation request (has questionName property)
	// // Create a new question
	// const { questionName, imagePath } = body;
	// const session = await auth();
	// const autorSessionId = session?.user.id;
	// const questionData = {
	// 	title: questionName,
	// 	authorId: autorSessionId,
	// 	imageUrl: imagePath || null,
	// };
	//
	// const response = await prisma.question.create({
	// 	data: questionData,
	// });
	//
	// return NextResponse.json(
	// 	{ success: true, data: response },
	// 	{ status: 200 },
	// );
}
