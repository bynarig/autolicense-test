"use server";

import { NextRequest, NextResponse } from "next/server";
import { signOut } from "@/app/(root)/user/(auth)/auth";

export async function POST(req: NextRequest) {
	try {
		await signOut({ redirect: false });
		return NextResponse.json(
			{ error: "Successful logout" },
			{ status: 200 },
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Invalid request", detail: (error as Error).message },
			{ status: 400 },
		);
	}
}
