"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UserMiddleware } from "@server/middleware/user.middleware";

type tParams = Promise<{ id: string }>;

export async function GET(req: NextRequest, { params }: { params: tParams }) {
	const middlewareCheck = await UserMiddleware.RequireAdmin(req);
	if (middlewareCheck) return middlewareCheck;
	try {
		const { id }: { id: string } = await params;

		if (!id) {
			return NextResponse.json(
				{ error: "Question ID is required" },
				{ status: 400 },
			);
		}

		const test = await prisma.question.findUnique({
			where: { id: id },
			include: {
				author: {
					select: {
						name: true,
						id: true,
					},
				},
			},
		});

		if (!test) {
			return NextResponse.json(
				{ error: "Question not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{ success: true, data: test },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error fetching Question:", error);
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

export async function PUT(req: NextRequest, { params }: { params: tParams }) {
	const middlewareCheck = await UserMiddleware.RequireAdmin(req);
	if (middlewareCheck) return middlewareCheck;

	const { id }: { id: string } = await params;
	const body = await req.json();
	const { title, imageUrl, text, points, category } = body;

	// Prepare update data
	const updateData: any = {};
	if (title !== undefined) updateData.title = title;
	if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
	if (text !== undefined) updateData.text = text;
	if (points !== undefined) updateData.points = parseInt(points);
	// if (category !== undefined) updateData.category = [category];
	console.log(updateData);
	// Add updatedAt timestamp using Prisma's update operation
	const response = await prisma.question.update({
		where: {
			id: id,
		},
		data: {
			...updateData,
			updatedAt: new Date(),
		},
	});

	return NextResponse.json(
		{ success: true, data: response },
		{ status: 200 },
	);
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: tParams },
) {
	const middlewareCheck = await UserMiddleware.RequireAdmin(req);
	if (middlewareCheck) return middlewareCheck;

	const { id }: { id: string } = await params;

	const response = await prisma.question.delete({
		where: {
			id: id,
		},
	});

	return NextResponse.json(
		{ success: true, data: response },
		{ status: 200 },
	);
}
