"use server";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@server/config/auth-js";

export async function adminServerMiddleware(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith("/api/admin")) {
		const session = await auth();
		if (session?.user?.role !== "ADMIN") {
			return NextResponse.rewrite(new URL("/", request.url));
		}
	}
}
