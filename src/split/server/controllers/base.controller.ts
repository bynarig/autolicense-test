import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@server/utils/apiResponse";

export class BaseController {
	protected async handleRequest(
		req: NextRequest,
		res: NextResponse,
		next: NextResponse,
		handler: () => Promise<any>,
	) {
		try {
			const result = await handler();
			return ApiResponse.success(res, result);
		} catch (error) {
			// Handle different types of errors
			if (error instanceof Error) {
				return NextResponse.json(
					{
						success: false,
						message: error.message || "An error occurred",
					},
					{ status: 500 },
				);
			}

			// Handle unknown errors
			return NextResponse.json(
				{
					success: false,
					message: "An unexpected error occurred",
				},
				{ status: 500 },
			);
		}
	}
}
