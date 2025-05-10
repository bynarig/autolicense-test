import { NextRequest, NextResponse } from "next/server";
import { QuestionsService } from "@server/services/questions.service";
import { BaseController } from "@server/controllers/base.controller";
import { NotFoundError } from "@server/utils/errorHandler";

type tParams = Promise<{ id: string }>;

export class QuestionsController extends BaseController {
	constructor(private questionsService: QuestionsService) {
		super();
	}

	getQuestions = async (req: NextRequest): Promise<NextResponse> => {
		return this.handleRequest(req, async () => {
			const result = await this.questionsService.getAllQuestions();
			return {
				questions: result.questions,
				pagination: result.pagination,
			};
		});
	};

	getQuestion = async (
		req: NextRequest,
		{ params }: { params: tParams },
	): Promise<NextResponse> => {
		return this.handleRequest(req, async () => {
			const { id }: { id: string } = await params;

			const result = await this.questionsService.getQuestion(id);
			if (!result) {
				throw new NotFoundError(`Question with id ${id} not found`);
			}
			return result;
		});
	};
	updateQuestion = async (
		req: NextRequest,
		{ params }: { params: tParams },
	): Promise<NextResponse> => {
		return this.handleRequest(req, async () => {
			const { id }: { id: string } = await params;

			const body = await req.json();
			const result = await this.questionsService.updateQuestion(body, id);
			if (!result) {
				throw new NotFoundError(`Question with id ${id} not found`);
			}
			return result;
		});
	};
	deleteQuestion = async (
		req: NextRequest,
		{ params }: { params: tParams },
	): Promise<NextResponse> => {
		return this.handleRequest(req, async () => {
			const { id }: { id: string } = await params;

			const result = await this.questionsService.deleteQuestion(id);
			if (!result) {
				throw new NotFoundError(`Question with id ${id} not found`);
			}
			return result;
		});
	};
	createQuestion = async (req: NextRequest): Promise<NextResponse> => {
		return this.handleRequest(req, async () => {
			const body = await req.json();

			// Check if this is a question creation request (has questionName property)
			// Create a new question
			const { questionName, imagePath } = body;
			const result = await this.questionsService.createQuestion(
				questionName,
				imagePath,
			);
			if (!result) {
				throw new NotFoundError("Error of question creation");
			}
			return result;
		});
	};
}
