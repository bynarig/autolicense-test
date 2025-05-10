import { NextResponse } from "next/server";

export class ApiResponse {
	static success(data: any = null, message: string = "Success"): void {
		NextResponse.json({
			success: true,
			status: 200,
			message,
			data,
		});
	}

	static error(
		message: string,
		statusCode: number = 400,
		code?: string,
	): void {
		NextResponse.json({
			success: false,
			status: statusCode,
			message,
			code: code || "ERR_0001",
			...(process.env.NODE_ENV === "development" && {
				stack: new Error().stack,
			}),
		});
	}
}
