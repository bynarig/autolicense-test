"use server";

import { NextRequest } from "next/server";
import { UserMiddleware } from "@server/middleware/user.middleware";
import { TestingService } from "@server/services/testing.service";
import { TestingController } from "@server/controllers/admin/testing.controller";

const testingService = new TestingService();
const testingController = new TestingController(testingService);

type tParams = Promise<{ id: string }>;

export async function GET(req: NextRequest, { params }: { params: tParams }) {
	const middlewareCheck = await UserMiddleware.RequireAdmin(req);
	if (middlewareCheck) return middlewareCheck;

	return testingController.getTest(req, { params });
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: tParams },
) {
	const middlewareCheck = await UserMiddleware.RequireAdmin(req);
	if (middlewareCheck) return middlewareCheck;

	return testingController.deleteTest(req, { params });
}
