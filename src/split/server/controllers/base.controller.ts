import { NextRequest, NextResponse } from "next/server";
import { handleError, handleSuccess } from "@server/utils/errorHandler";

export class BaseController {
	protected async handleRequest(
		req: NextRequest,
		handler: () => Promise<any>,
	): Promise<NextResponse> {
		try {
			const result = await handler();
			return handleSuccess(result);
		} catch (error) {
			return handleError(error);
		}
	}
}
