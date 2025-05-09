"use server";

import { NextResponse } from "next/server";
import { signOut } from "@server/config/auth-js";

export async function POST() {
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
