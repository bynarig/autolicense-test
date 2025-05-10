"use server";

import { NextRequest } from "next/server";
import { UserMiddleware } from "@server/middleware/user.middleware";
import { TestingController } from "@server/controllers/admin/testing.controller";
import { TestingService } from "@server/services/testing.service";

const testingService = new TestingService();
const testingController = new TestingController(testingService);

export async function POST(req: NextRequest) {
	const middlewareCheck = await UserMiddleware.RequireAdmin(req);
	if (middlewareCheck) return middlewareCheck;

	return testingController.createTest(req);
}

export async function GET(req: NextRequest) {
	const middlewareCheck = await UserMiddleware.RequireAdmin(req);
	if (middlewareCheck) return middlewareCheck;

	return testingController.getTests(req);
}
