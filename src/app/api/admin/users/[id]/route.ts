"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/db";
import { isAdmin } from "@/features/role-check";
import { auth } from "@/app/(root)/user/(auth)/auth";
import Bcrypt from "@/shared/lib/bcrypt";
import { deleteImage } from "@/shared/lib/image-service";

type tParams = Promise<{ id: string }>;

// Corrected GET function signature
export async function GET(req: Request, { params }: { params: tParams }) {
	try {
		// Extract id early to avoid multiple await calls
		const { id }: { id: string } = await params;

		if (!(await isAdmin())) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		// Removed await from params destructuring
		// const { id } = await params;

		if (!id) {
			return NextResponse.json(
				{ error: "User ID is required" },
				{ status: 400 },
			);
		}

		const user = await prisma.user.findUnique({
			where: { id: id },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{ success: true, data: user },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error fetching user:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				detail:
					error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

export async function DELETE(req: Request, { params }: { params: tParams }) {
	try {
		// Extract id early to avoid multiple await calls
		const { id }: { id: string } = await params;

		if (await isAdmin()) {
			const session = await auth();
			if (session?.user.id !== id) {
				const response = await prisma.user.delete({
					where: {
						id: id,
					},
				});
				return NextResponse.json(
					{ success: true, data: response },
					{ status: 200 },
				);
			} else {
				return NextResponse.json(
					{ error: "Cannot delete yourself" },
					{ status: 403 },
				);
			}
		} else {
			return NextResponse.json({ error: "No access" }, { status: 403 });
		}
	} catch (error) {
		return NextResponse.json(
			{ error: "Invalid request", detail: (error as Error).message },
			{ status: 400 },
		);
	}
}

export async function POST(req: Request, { params }: { params: tParams }) {
	try {
		// Extract id early to avoid multiple await calls
		const { id } = await params;

		if (await isAdmin()) {
			const {
				email,
				subscriptionExpiresAt,
				role,
				name,
				username,
				avatarUrl,
				password,
				adminPassword,
				subscriptionLVL,
				subscriptionType,
				emailVerified,
			} = await req.json();

			// Create an empty data object
			const updateData = {} as any;

			// Only add fields to the update if they are provided
			if (email !== undefined && email !== null && email !== "") {
				updateData.email = email;
			}

			if (
				subscriptionExpiresAt !== undefined &&
				subscriptionExpiresAt !== null
			) {
				// Ensure subscriptionExpiresAt is a valid Date object
				updateData.subscriptionExpiresAt =
					typeof subscriptionExpiresAt === "string"
						? new Date(subscriptionExpiresAt)
						: subscriptionExpiresAt;
			}

			if (role !== undefined && role !== null && role !== "") {
				updateData.role = role;
			}

			if (name !== undefined && name !== null && name !== "") {
				updateData.name = name;
			}

			if (
				username !== undefined &&
				username !== null &&
				username !== ""
			) {
				updateData.username = username;
			}

			// Only update avatarUrl if it's provided
			if (
				avatarUrl !== undefined &&
				avatarUrl !== null &&
				avatarUrl !== ""
			) {
				// Get the current user to check if they already have an avatar
				const currentUser = await prisma.user.findUnique({
					where: { id },
					select: { avatarUrl: true },
				});

				// If the user has an existing avatar, delete it from storage
				if (currentUser?.avatarUrl) {
					try {
						// With the new approach, avatarUrl is already just the path
						// No need to extract it from a full URL
						await deleteImage(currentUser.avatarUrl);
						console.log(
							`Deleted old avatar: ${currentUser.avatarUrl}`,
						);
					} catch (error) {
						console.error("Error deleting old avatar:", error);
						// Continue with the update even if deletion fails
					}
				}

				updateData.avatarUrl = avatarUrl;
			}

			// Handle password update if provided
			if (
				password !== undefined &&
				password !== null &&
				password !== ""
			) {
				// Verify admin password before allowing password change
				if (!adminPassword) {
					return NextResponse.json(
						{
							error: "Admin password is required to change user's password",
						},
						{ status: 400 },
					);
				}

				// Get the current admin user
				const session = await auth();
				if (!session?.user?.email) {
					return NextResponse.json(
						{ error: "Admin session not found" },
						{ status: 401 },
					);
				}

				// Get the admin user from the database - only fetch the password field
				const adminUser = await prisma.user.findUnique({
					where: { email: session.user.email },
					select: { password: true },
				});

				if (!adminUser || !adminUser.password) {
					return NextResponse.json(
						{ error: "Admin user not found" },
						{ status: 404 },
					);
				}

				// Verify the admin password
				const isPasswordValid = await Bcrypt.compare(
					adminPassword,
					adminUser.password,
				);
				if (!isPasswordValid) {
					return NextResponse.json(
						{ error: "Invalid admin password" },
						{ status: 401 },
					);
				}

				// Password is valid, proceed with update
				// Hash the password before storing it
				updateData.password = await Bcrypt.hash(password);
			}

			// Handle subscription level update if provided
			if (subscriptionLVL !== undefined && subscriptionLVL !== null) {
				// Convert subscriptionLVL to integer if it's a string
				const parsedLevel =
					typeof subscriptionLVL === "string"
						? parseInt(subscriptionLVL, 10)
						: subscriptionLVL;

				// Only add to updateData if it's a valid number
				if (!isNaN(parsedLevel)) {
					updateData.subscriptionLVL = parsedLevel;
				}
			}

			// Handle subscription type update if provided
			if (
				subscriptionType !== undefined &&
				subscriptionType !== null &&
				subscriptionType !== ""
			) {
				updateData.subscriptionType = subscriptionType;
			}

			// Handle email verification status update if provided
			// Use explicit check for undefined or null since emailVerified can be false
			if (emailVerified !== undefined && emailVerified !== null) {
				// Convert emailVerified to boolean if it's not already
				updateData.emailVerified =
					typeof emailVerified === "string"
						? emailVerified === "true"
						: Boolean(emailVerified);
			}

			// Check if updateData is empty
			if (Object.keys(updateData).length === 0) {
				return NextResponse.json(
					{ error: "No valid fields to update" },
					{ status: 400 },
				);
			}
			const response = await prisma.user.update({
				where: {
					id: id,
				},
				data: updateData,
			});
			return NextResponse.json(
				{ success: true, data: response },
				{ status: 200 },
			);
		} else {
			return NextResponse.json({ error: "No access" }, { status: 403 });
		}
	} catch (error) {
		return NextResponse.json(
			{ error: "Invalid request", detail: (error as Error).message },
			{ status: 400 },
		);
	}
}
