import { NextRequest, NextResponse } from "next/server";
import { UsersService } from "@server/services/users.service";
import { BaseController } from "@server/controllers/base.controller";
import { NotFoundError } from "@server/utils/errorHandler";

type tParams = Promise<{ id: string }>;

export class UsersController extends BaseController {
	constructor(private usersService: UsersService) {
		super();
	}

	getUser = async (
		req: NextRequest,
		{ params }: { params: tParams },
	): Promise<NextResponse> => {
		return this.handleRequest(req, async () => {
			const { id }: { id: string } = await params;

			const result = await this.usersService.getUser(id);
			if (!result) {
				throw new NotFoundError(`User with id ${id} not found`);
			}
			return result;
		});
	};
	deleteUser = async (
		req: NextRequest,
		{ params }: { params: tParams },
	): Promise<NextResponse> => {
		return this.handleRequest(req, async () => {
			const { id }: { id: string } = await params;

			const result = await this.usersService.deleteUser(id);
			if (!result) {
				throw new NotFoundError(`User with id ${id} not found`);
			}
			return result;
		});
	};
	patchUser = async (
		req: NextRequest,
		{ params }: { params: tParams },
	): Promise<NextResponse> => {
		return this.handleRequest(req, async () => {
			const { id }: { id: string } = await params;
			const { changedFields } = await req.json();
			console.log(JSON.stringify(changedFields));
			const result = await this.usersService.patchUser(changedFields, id);
			if (!result) {
				throw new NotFoundError(`User with id ${id} not found`);
			}
			return result;
		});
	};
}
