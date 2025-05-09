"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/app/(root)/user/(auth)/auth";
import { deleteImage } from "@/split/server/services/image.service";

export async function POST(req: Request) {
	try {
		// Get the current user session
		const session = await auth();

		// Check if user is authenticated
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: "Authentication required" },
				{ status: 401 },
			);
		}

		const userId = session.user.id;

		// Parse the request body
		const { name, username, avatarUrl } = await req.json();

		// Create an empty data object for updates
		const updateData: any = {};

		// Only add fields to the update if they are provided
		if (name !== undefined && name !== null && name !== "") {
			updateData.name = name;
		}

		if (username !== undefined && username !== null && username !== "") {
			updateData.username = username;
		}

		// Handle avatar URL update if provided
		if (avatarUrl !== undefined && avatarUrl !== null && avatarUrl !== "") {
			// Get the current user to check if they already have an avatar
			const currentUser = await prisma.user.findUnique({
				where: { id: userId },
				select: { avatarUrl: true },
			});

			// If the user has an existing avatar, delete it from storage
			if (currentUser?.avatarUrl) {
				try {
					await deleteImage(currentUser.avatarUrl);
				} catch (error) {
					console.error("Error deleting previous avatar:", error);
				}
			}

			updateData.avatarUrl = avatarUrl;
		}

		// Check if updateData is empty
		if (Object.keys(updateData).length === 0) {
			return NextResponse.json(
				{ error: "No valid fields to update" },
				{ status: 400 },
			);
		}

		// Update the user in the database with updatedAt timestamp
		const updatedUser = await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				...updateData,
				updatedAt: new Date(),
			},
		});

		return NextResponse.json(
			{ success: true, data: updatedUser },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error updating user profile:", error);
		return NextResponse.json(
			{
				error: "Failed to update profile",
				detail:
					error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
