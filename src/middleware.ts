import type { NextRequest } from "next/server";
import { adminMiddleware } from "@/app/adminpanel/middleware";
import { userAuthMiddleware } from "@/app/(root)/user/(auth)/middleware";

export async function middleware(request: NextRequest) {
	adminMiddleware(request);
	userAuthMiddleware(request);
}

export const config = {};
