import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSessionWrapper } from "@client/services/session.service";

export async function adminMiddleware(req: NextRequest) {
	if (req.nextUrl.pathname.startsWith("/adminpanel")) {
		const session = await getSessionWrapper();
		if (session?.user?.role !== "ADMIN") {
			return NextResponse.rewrite(new URL("/", req.url));
		}
	}
}
