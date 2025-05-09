import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSessionWrapper } from "@client/services/session.service";

export async function userAuthMiddleware(req: NextRequest) {
	if (req.nextUrl.pathname.startsWith("/user/profile")) {
		const session = await getSessionWrapper();
		if (!(session && session.user)) {
			return NextResponse.rewrite(new URL("/", req.url));
		}
	}
}
