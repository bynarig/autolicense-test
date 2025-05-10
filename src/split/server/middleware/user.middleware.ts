import { auth } from "@server/config/auth-js";
import { NextRequest, NextResponse } from "next/server";

export class UserMiddleware {
	static async RequireAdmin(req: NextRequest) {
		const session = await auth();
		if (!(session?.user?.role === "ADMIN")) {
			return NextResponse.json(
				{
					success: false,
					message: "You are not authorized to access this page",
				},
				{ status: 403 },
			);
		}
		return null;
	}
}
