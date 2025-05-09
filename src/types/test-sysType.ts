import { UserType } from "@/types/userType";

export interface TestType {
	id: string;
	createdAt: Date;
	updatedAt?: Date | null;
	deletedAt?: Date | null;
	category: string[];
	tags: string[];
	title: string | null;
	slug: string | null;
	description: string | null;
	difficulty: string | null;
	timeCompleted?: number | null;
	content: string | null;
	published: boolean;
	views: number;
	attempts: number;
	maxScore?: number | null;
	authorId: string;
	author?: Partial<UserType>;
	questions?: QuestionType[];
}

export interface QuestionType {
	id: string;
	title: string;
	imageUrl?: string | null;
	text?: string | null;
	category: string[];
	type?: string | null;
	order?: number | null;
	points: number;
	testId?: string | null;
	test?: Partial<TestType>;
	answers?: AnswerType[];
	authorId: string;
	author?: Partial<UserType>;
	questionDiscussion?: QuestionDiscussionType;
	createdAt: Date;
	updatedAt?: Date;
	deletedAt?: Date;
	views?: number;
	attempts?: number;
}

/**
 * Answer model type definition
 * Based on the Prisma Answer model
 */
export interface AnswerType {
	id: string;
	title: string;
	isTrue: boolean;
	price: number;
	feedback?: string | null;
	questionId: string;
	question?: Partial<QuestionType>;
}

/**
 * QuestionDiscussion type definition
 * Based on the Prisma QuestionDiscussion type
 */
export interface QuestionDiscussionType {
	text: string;
}

/**
 * License Question type for the license test feature
 */
export interface LicenseQuestionType {
	id: string;
	question: string;
	image?: string;
	answers: LicenseAnswerType[];
}

/**
 * License Answer type for the license test feature
 */
export interface LicenseAnswerType {
	id: string;
	text: string;
	isCorrect: boolean;
}
