import { prisma } from "@/lib/db";
import { UserType } from "@/types";

export class UsersService {
	async getUsers() {}

	async getUser(id: string) {
		return prisma.user.findUnique({
			where: { id: id },
		});
	}

	async deleteUser(id: string) {
		return prisma.user.delete({
			where: {
				id: id,
			},
		});
	}

	async patchUser(data: Partial<UserType>, id: string) {
		return prisma.user.update({
			where: {
				id: id,
			},
			data: data,
		});
	}
}
