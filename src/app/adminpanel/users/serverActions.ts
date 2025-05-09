"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { validateSearchInput } from "@/validators/validateSearchInput";

/**
 * Server action to fetch users with caching
 * Uses Next.js built-in caching mechanisms
 */
export async function fetchUsersServer(
	searchTerm: string = "",
	page: number = 1,
	limit: number = 10,
) {
	try {
		// Build the where clause based on input type
		let whereClause: any = {};

		if (searchTerm) {
			const inputType = validateSearchInput(searchTerm);

			switch (inputType) {
				case "email":
					whereClause = {
						email: {
							contains: searchTerm,
							mode: "insensitive", // Case-insensitive search
						},
					};
					break;
				case "name":
					whereClause = {
						name: {
							contains: searchTerm,
							mode: "insensitive", // Case-insensitive search
						},
					};
					break;
				case "id":
					// For ID, we still use exact match
					whereClause = { id: searchTerm };
					break;
				case "role":
					whereClause = {
						role: {
							equals: searchTerm.toUpperCase() as any,
						},
					};
					break;
				default:
					// If input type is not specified or invalid, search across multiple fields
					whereClause = {
						OR: [
							{
								name: {
									contains: searchTerm,
									mode: "insensitive",
								},
							},
							{
								email: {
									contains: searchTerm,
									mode: "insensitive",
								},
							},
							{
								id:
									searchTerm.length === 24
										? searchTerm
										: undefined,
							},
						],
					};
			}
		}

		const skip = (page - 1) * limit;

		// Use Prisma transaction to execute both queries in a single database round trip
		const [totalCount, users] = await prisma.$transaction([
			prisma.user.count({
				where: whereClause,
			}),
			prisma.user.findMany({
				where: whereClause,
				skip,
				take: limit,
				orderBy: {
					createdAt: "desc", // Most recent users first
				},
			}),
		]);

		return {
			users,
			totalCount,
			pagination: {
				page,
				limit,
				totalPages: Math.ceil(totalCount / limit),
			},
		};
	} catch (error) {
		console.error("Error fetching users:", error);
		throw new Error(
			`Failed to fetch users: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

/**
 * Server action to revalidate users data
 * This can be called after mutations to refresh the cache
 */
export async function revalidateUsers() {
	revalidatePath("/adminpanel/users");
}
