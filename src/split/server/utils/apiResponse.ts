"use server";

import { NextResponse } from "next/server";

export class ApiResponse {
	static success(
		res: NextResponse,
		data: any = null,
		message: string = "Success",
	): void {
		res.status(200).json({
			success: true,
			message,
			data,
		});
	}

	static error(
		res: NextResponse,
		message: string,
		statusCode: number = 400,
		code?: string,
	): void {
		res.status(statusCode).json({
			success: false,
			message,
			code,
			...(process.env.NODE_ENV === "development" && {
				stack: new Error().stack,
			}),
		});
	}
}
