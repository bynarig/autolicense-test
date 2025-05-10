import { prisma } from "@/lib/db";
import { QuestionType } from "@/types";
import { auth } from "@server/config/auth-js";

export class QuestionsService {
	async getAllQuestions(page: number = 1, limit: number = 50) {
		const pagination = {};
		// Default pagination values
		// page = pagination?.page || 1;

		// limit = pagination?.limit || 50;
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
		return {
			questions,
			pagination: {
				totalCount,
				page,
				limit,
				totalPages: Math.ceil(totalCount / limit),
			},
		};
	}

	async getQuestion(id: string) {
		return prisma.question.findUnique({
			where: { id: id },
			include: {
				author: {
					select: {
						name: true,
						id: true,
					},
				},
			},
		});
	}

	async updateQuestion(data: Partial<QuestionType>, id: string) {
		const updateData = {
			title: data.title,
			imageUrl: data.imageUrl,
			text: data.text,
			points: data.points,
			category: data.category,
			type: data.type,
			order: data.order,
			updatedAt: new Date(),
		};

		return prisma.question.update({
			where: {
				id: id,
			},
			data: updateData,
		});
	}

	async deleteQuestion(id: string) {
		return prisma.question.delete({
			where: {
				id: id,
			},
		});
	}

	async createQuestion(
		questionName: string,
		imagePath: string | null = null,
	) {
		const session = await auth();
		const autorSessionId = session?.user.id;
		const questionData = {
			title: questionName,
			authorId: autorSessionId,
			imageUrl: imagePath || null,
		};

		return prisma.question.create({
			data: questionData,
		});
	}
}
