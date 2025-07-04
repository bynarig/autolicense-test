import { z } from "zod";

export const authSchema = z.object({
	email: z.string().email({
		message: "Email must be a valid email address.",
	}),
	password: z
		.string({ required_error: "Password is required" })
		.min(1, "Password is required")
		.min(8, "Password must be more than 8 characters")
		.max(32, "Password must be less than 32 characters"),
});

export const searchSchema = z.object({
	search: z.string(),
});

export const testValidationSchema = z.object({
	name: z.string(),
	title: z.string(),
	username: z.string(),
	text: z.string(),
	points: z.number().min(1),
	email: z.string().email({
		message: "Email must be a valid email address.",
	}),
	role: z.string(),
	category: z.string(),
	avatarUrl: z.string(),
	subscriptionExpiresAt: z.date(),
	password: z
		.string({ required_error: "Password is required" })
		.min(1, "Password is required")
		.min(8, "Password must be more than 8 characters")
		.max(32, "Password must be less than 32 characters"),
});

export const emailSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
});

export const userValidationSchema = z.object({
	name: z.string().min(1, "Name is required").max(50, "Name is too long"),
	username: z
		.string()
		.min(1, "Username is required")
		.max(50, "Username is too long"),
	email: z.string().email("Invalid email address"),
	role: z.string().min(1, "Role is required"),
	password: z
		.string({ required_error: "Password is required" })
		.min(1, "Password is required")
		.min(8, "Password must be more than 8 characters")
		.max(32, "Password must be less than 32 characters")
		.optional(),
	subscriptionExpiresAt: z.date(),
	avatarUrl: z.string(),
	subscriptionLVL: z.number(),
	subscriptionType: z.string(),
	emailVerified: z.boolean(),
});
