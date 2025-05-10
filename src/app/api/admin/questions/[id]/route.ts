"use server";

import { NextRequest } from "next/server";
import { UserMiddleware } from "@server/middleware/user.middleware";
import { QuestionsService } from "@server/services/questions.service";
import { QuestionsController } from "@server/controllers/admin/questions.controller";

type tParams = Promise<{ id: string }>;

const questionsService = new QuestionsService();
const questionsController = new QuestionsController(questionsService);

export async function GET(req: NextRequest, { params }: { params: tParams }) {
	const middlewareCheck = await UserMiddleware.RequireAdmin(req);
	if (middlewareCheck) return middlewareCheck;

	return questionsController.getQuestion(req, { params });
}

export async function PUT(req: NextRequest, { params }: { params: tParams }) {
	const middlewareCheck = await UserMiddleware.RequireAdmin(req);
	if (middlewareCheck) return middlewareCheck;

	return questionsController.updateQuestion(req, { params });
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: tParams },
) {
	const middlewareCheck = await UserMiddleware.RequireAdmin(req);
	if (middlewareCheck) return middlewareCheck;

	return questionsController.deleteQuestion(req, { params });
}
