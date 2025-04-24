import { Metadata } from "next";
import { prisma } from "@/shared/lib/db";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export const metadata: Metadata = {
	title: "Dashboard | Admin Panel",
	description: "Admin dashboard with key statistics and metrics",
};

/**
 * StatsCard component for displaying individual statistics
 */
function StatsCard({
	title,
	value,
	description,
}: {
	title: string;
	value: string | number;
	description?: string;
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				{description && (
					<p className="text-xs text-muted-foreground mt-2">
						{description}
					</p>
				)}
			</CardContent>
		</Card>
	);
}

/**
 * Server component for the admin dashboard
 * Fetches statistics data on the server for better performance
 */
export default async function Page() {
	// Fetch statistics data using Prisma transaction for efficiency
	const [
		totalUsers,
		adminUsers,
		regularUsers,
		unapprovedUsers,
		newUsersLast7Days,
		newUsersLast30Days,
		totalTests,
		publishedTests,
		totalQuestions,
		mostViewedTest,
		mostAttemptedTest,
	] = await prisma.$transaction([
		// User statistics
		prisma.user.count(),
		prisma.user.count({ where: { role: "ADMIN" } }),
		prisma.user.count({ where: { role: "USER" } }),
		prisma.user.count({ where: { role: "UNAPPROVED" } }),
		prisma.user.count({
			where: {
				createdAt: {
					gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
				},
			},
		}),
		prisma.user.count({
			where: {
				createdAt: {
					gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
				},
			},
		}),

		// Test statistics
		prisma.test.count(),
		prisma.test.count({ where: { published: true } }),
		prisma.question.count(),

		// Most viewed test
		prisma.test.findFirst({
			orderBy: { views: "desc" },
			select: { title: true, views: true, createdAt: true },
		}),

		// Most attempted test
		prisma.test.findFirst({
			orderBy: { attempts: "desc" },
			select: { title: true, attempts: true, createdAt: true },
		}),
	]);

	// Calculate average questions per test
	const avgQuestionsPerTest =
		totalTests > 0
			? Math.round((totalQuestions / totalTests) * 10) / 10
			: 0;

	return (
		<div className="p-6 space-y-6">
			<div className="flex flex-col space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
				<p className="text-muted-foreground">
					Overview of your application statistics and metrics
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatsCard
					title="Total Users"
					value={totalUsers}
					description={`${newUsersLast30Days} new in the last 30 days`}
				/>
				<StatsCard
					title="Admin Users"
					value={adminUsers}
					description={
						totalUsers > 0
							? `${Math.round((adminUsers / totalUsers) * 100)}% of total users`
							: "0% of total users"
					}
				/>
				<StatsCard
					title="Regular Users"
					value={regularUsers}
					description={
						totalUsers > 0
							? `${Math.round((regularUsers / totalUsers) * 100)}% of total users`
							: "0% of total users"
					}
				/>
				<StatsCard
					title="Unapproved Users"
					value={unapprovedUsers}
					description={
						totalUsers > 0
							? `${Math.round((unapprovedUsers / totalUsers) * 100)}% of total users`
							: "0% of total users"
					}
				/>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatsCard
					title="Total Tests"
					value={totalTests}
					description={
						totalTests > 0
							? `${publishedTests} published (${Math.round((publishedTests / totalTests) * 100)}%)`
							: `${publishedTests} published (0%)`
					}
				/>
				<StatsCard
					title="Total Questions"
					value={totalQuestions}
					description={`${avgQuestionsPerTest} questions per test on average`}
				/>
				<StatsCard
					title="New Users (7 days)"
					value={newUsersLast7Days}
					description={
						totalUsers > 0
							? `${Math.round((newUsersLast7Days / totalUsers) * 100)}% of total users`
							: "0% of total users"
					}
				/>
				<StatsCard
					title="New Users (30 days)"
					value={newUsersLast30Days}
					description={
						totalUsers > 0
							? `${Math.round((newUsersLast30Days / totalUsers) * 100)}% of total users`
							: "0% of total users"
					}
				/>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{mostViewedTest && (
					<Card>
						<CardHeader>
							<CardTitle>Most Viewed Test</CardTitle>
							<CardDescription>
								Created{" "}
								{formatDistanceToNow(
									new Date(mostViewedTest.createdAt),
									{ addSuffix: true },
								)}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold mb-2">
								{mostViewedTest.title || "Untitled Test"}
							</div>
							<p className="text-muted-foreground">
								{mostViewedTest.views} views
							</p>
						</CardContent>
					</Card>
				)}

				{mostAttemptedTest && (
					<Card>
						<CardHeader>
							<CardTitle>Most Attempted Test</CardTitle>
							<CardDescription>
								Created{" "}
								{formatDistanceToNow(
									new Date(mostAttemptedTest.createdAt),
									{ addSuffix: true },
								)}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold mb-2">
								{mostAttemptedTest.title || "Untitled Test"}
							</div>
							<p className="text-muted-foreground">
								{mostAttemptedTest.attempts} attempts
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
