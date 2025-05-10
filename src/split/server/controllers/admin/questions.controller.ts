import { NextRequest, NextResponse } from "next/server";
import { QuestionsService } from "@server/services/questions.service";
import { BaseController } from "@server/controllers/base.controller";

export class QuestionsController extends BaseController {
	constructor(private questionsService: QuestionsService) {
		super();
	}

	getQuestions = async (req: NextRequest): Promise<NextResponse> => {
		try {
			const result = await this.questionsService.getAllQuestions();
			return NextResponse.json(
				{
					success: true,
					data: result.questions,
					pagination: result.pagination,
				},
				{ status: 200 },
			);
		} catch (error) {
			return NextResponse.json(
				{ success: false, message: "Failed to fetch questions" },
				{ status: 500 },
			);
		}
	};
}
