import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
	DATABASE_URL: z.string(),
	PORT: z
		.string()
		.transform(Number)
		.refine((n) => n >= 1024 && n <= 65535, {
			message: "Port must be between 1024 and 65535",
		}),
	NODE_ENV: z.enum(["development", "production", "test"]),
	NEXTAUTH_SECRET: z.string(),
	SMTP_HOST:
		process.env.NODE_ENV === "development"
			? z.string().optional()
			: z.string(),
	SMTP_PORT:
		process.env.NODE_ENV === "development"
			? z.string().transform(Number).optional()
			: z.string().transform(Number),
	SMTP_USER:
		process.env.NODE_ENV === "development"
			? z.string().optional()
			: z.string(),
	SMTP_PASS:
		process.env.NODE_ENV === "development"
			? z.string().optional()
			: z.string(),
	APP_NAME:
		process.env.NODE_ENV === "development"
			? z.string().optional().default("Express Boilerplate")
			: z.string(),
});

export const ENV = envSchema.parse(process.env);

// export const ENV = async () => {
// 	return envSchema.parseAsync(process.env);
// };

// Add validation for production environment
if (process.env.NODE_ENV === "production") {
	const requiredFields = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];

	requiredFields.forEach((field) => {
		if (!process.env[field]) {
			throw new Error(`Missing required env variable: ${field}`);
		}
	});
}
