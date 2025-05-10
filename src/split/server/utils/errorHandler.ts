import { AppError } from "./appError";
import { logger } from "@server/config/logger";
import { ErrorCode } from "./errorCodes";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export class ErrorHandler {
	static handle(error: unknown, context: string) {
		// Handle Prisma errors
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			const prismaError = this.handlePrismaError(error);
			logger.warn("Prisma error occurred", {
				message: prismaError.message,
				context,
				code: prismaError.code,
				statusCode: prismaError.statusCode,
				prismaCode: error.code,
				meta: error.meta,
			});
			return prismaError;
		}

		// Handle Prisma validation errors
		if (error instanceof Prisma.PrismaClientValidationError) {
			const validationError = new AppError(
				"Invalid input data",
				400,
				ErrorCode.VALIDATION_ERROR,
			);
			logger.warn("Prisma validation error occurred", {
				message: error.message,
				context,
				stack: error.stack,
			});
			return validationError;
		}

		if (error instanceof AppError) {
			logger.warn("Application error occurred", {
				message: error.message,
				context,
				code: error.code,
				statusCode: error.statusCode,
				details: error.details,
				stack: error.stack,
			});
			return error;
		}

		// Log unknown errors
		const unknownError = new AppError(
			"Internal server error",
			500,
			ErrorCode.INTERNAL_SERVER_ERROR,
			false,
		);

		logger.error("Unknown error occurred", {
			message: error instanceof Error ? error.message : "Unknown error",
			context,
			error: error instanceof Error ? error.stack : JSON.stringify(error),
			details: error instanceof Error ? error : undefined,
		});

		return unknownError;
	}

	private static handlePrismaError(
		error: Prisma.PrismaClientKnownRequestError,
	): AppError {
		switch (error.code) {
			case "P2002":
				return new AppError(
					"Resource already exists",
					409,
					ErrorCode.ALREADY_EXISTS,
				);
			case "P2025":
			case "P2023": // Handle invalid ObjectID error
				return new AppError(
					"Resource not found",
					404,
					ErrorCode.NOT_FOUND,
				);
			default:
				return new AppError(
					"Database error",
					500,
					ErrorCode.DB_ERROR,
					false,
				);
		}
	}
}

// Add more specific error types
export class ValidationError extends AppError {
	constructor(message: string) {
		super(message, 400, ErrorCode.VALIDATION_ERROR);
	}
}

export class DatabaseError extends AppError {
	constructor(message: string) {
		super(message, 500, ErrorCode.DB_ERROR);
	}
}

// Custom error classes
export class NotFoundError extends AppError {
	constructor(message: string = "Resource not found") {
		super(message, 404, ErrorCode.NOT_FOUND);
	}
}

export class UnauthorizedError extends AppError {
	constructor(message: string = "Unauthorized access") {
		super(message, 401, ErrorCode.UNAUTHORIZED);
	}
}

export class ForbiddenError extends AppError {
	constructor(message: string = "Forbidden access") {
		super(message, 403, ErrorCode.FORBIDDEN);
	}
}

// Error response handler
export const handleError = (error: unknown) => {
	console.error("Error:", error);

	if (error instanceof AppError) {
		return NextResponse.json(
			{
				success: false,
				message: error.message,
				code: error.code,
			},
			{ status: error.statusCode },
		);
	}

	// Handle Prisma errors
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		const handledError = ErrorHandler.handle(error, "API");
		return NextResponse.json(
			{
				success: false,
				message: handledError.message,
				code: handledError.code,
			},
			{ status: handledError.statusCode },
		);
	}

	// Handle unknown errors
	return NextResponse.json(
		{
			success: false,
			message: "An unexpected error occurred",
			code: "INTERNAL_SERVER_ERROR",
		},
		{ status: 500 },
	);
};

// Success response handler
export const handleSuccess = (data: any, message?: string) => {
	return NextResponse.json(
		{
			success: true,
			data,
			message,
		},
		{ status: 200 },
	);
};
