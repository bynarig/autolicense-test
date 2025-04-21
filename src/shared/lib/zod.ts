import { z } from "zod";

export const formSchema = z.object({
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
});
