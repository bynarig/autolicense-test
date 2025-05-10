"use server";

import { NextRequest } from "next/server";
import { UserMiddleware } from "@server/middleware/user.middleware";
import { UsersService } from "@server/services/users.service";
import { UsersController } from "@/split/server/controllers/admin/users.controller";

type tParams = Promise<{ id: string }>;

const usersService = new UsersService();
const usersController = new UsersController(usersService);

export async function GET(req: NextRequest, { params }: { params: tParams }) {
	const middlewareCheck = await UserMiddleware.RequireAdmin(req);
	if (middlewareCheck) return middlewareCheck;

	return usersController.getUser(req, { params });
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: tParams },
) {
	const middlewareCheck = await UserMiddleware.RequireAdmin(req);
	if (middlewareCheck) return middlewareCheck;
	return usersController.deleteUser(req, { params });
}

export async function PATCH(req: NextRequest, { params }: { params: tParams }) {
	const middlewareCheck = await UserMiddleware.RequireAdmin(req);
	if (middlewareCheck) return middlewareCheck;

	return usersController.patchUser(req, { params });
}
