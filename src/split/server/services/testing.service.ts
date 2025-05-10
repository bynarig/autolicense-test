import { prisma } from "@/lib/db";

interface CreateTestData {
	title: string;
	authorId: string;
}

export class TestingService {
	async getAllTests(page: number = 1, limit: number = 50) {
		const skip = (page - 1) * limit;

		// Get total count for pagination
		const totalCount = await prisma.test.count();

		// Get paginated results
		const tests = await prisma.test.findMany({
			cacheStrategy: {
				ttl: 60,
			},
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

		return {
			tests,
			pagination: {
				totalCount,
				page,
				limit,
				totalPages: Math.ceil(totalCount / limit),
			},
		};
	}

	async getTest(id: string) {
		return prisma.test.findUnique({
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

	async deleteTest(id: string) {
		return prisma.test.delete({
			where: {
				id: id,
			},
		});
	}

	async createTest(data: CreateTestData) {
		return prisma.test.create({
			data,
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
}
