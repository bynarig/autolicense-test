/**
 * Common type definitions for the application
 * This file centralizes all model types used across the application
 */

/**
 * User model type definition
 * Based on the Prisma User model
 */

import { Role } from "@prisma/client";

export interface User {
	id: string;
	email: string | null;
	password?: string | null;
	username: string | null;
	name: string;
	avatarUrl: string | null;
	createdAt: Date;
	editedAt: Date | null;
	deletedAt: Date | null;
	lastLogin: Date | null;
	resetToken?: string | null;
	resetTokenExpiry?: Date | null;
	twoFactorEnabled: boolean;
	twoFactorSecret?: string | null;
	emailVerified: boolean;
	subscriptionLVL: number;
	subscriptionType?: string | null;
	subscriptionExpiresAt?: Date | null;
	role: Role;
}

/**
 * Test model type definition
 * Based on the Prisma Test model
 */
export interface Test {
	id: string;
	createdAt: Date;
	editedAt?: Date | null;
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
	author?: Partial<User>;
	questions?: Question[];
}

/**
 * Question model type definition
 * Based on the Prisma Question model
 */
export interface Question {
	id: string;
	title: string;
	imageUrl?: string | null;
	explanation?: string | null;
	category: string[];
	type?: string | null;
	order?: number | null;
	points: number;
	testId?: string | null;
	test?: Partial<Test>;
	answers?: Answer[];
	authorId: string;
	author?: Partial<User>;
	questionDiscussion?: QuestionDiscussion;
}

/**
 * Answer model type definition
 * Based on the Prisma Answer model
 */
export interface Answer {
	id: string;
	title: string;
	isTrue: boolean;
	price: number;
	feedback?: string | null;
	questionId: string;
	question?: Partial<Question>;
}

/**
 * QuestionDiscussion type definition
 * Based on the Prisma QuestionDiscussion type
 */
export interface QuestionDiscussion {
	text: string;
}

/**
 * License Question type for the license test feature
 */
export interface LicenseQuestion {
	id: string;
	question: string;
	image?: string;
	answers: LicenseAnswer[];
}

/**
 * License Answer type for the license test feature
 */
export interface LicenseAnswer {
	id: string;
	text: string;
	isCorrect: boolean;
}
