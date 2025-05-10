import { prisma } from "@/lib/db";

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
}
