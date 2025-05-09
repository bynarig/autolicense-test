// import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { UsersClient } from "@/components/UsersClient";

// export const metadata: Metadata = {
//   title: "Users Management | Admin Panel",
//   description: "Manage users, search, and view user details",
// };

/**
 * Server component for the users page
 * Fetches initial data on the server for better performance and SEO
 */
export default async function Page() {
	// Fetch initial users data on the server
	const itemsPerPage = 50;

	// Use Prisma transaction to execute both queries in a single database round trip
	const [totalCount, users] = await prisma.$transaction([
		prisma.user.count(),
		prisma.user.findMany({
			take: itemsPerPage,
			orderBy: {
				createdAt: "desc", // Most recent users first
			},
		}),
	]);

	return <UsersClient initialUsers={users} initialTotalCount={totalCount} />;
}
