"use server";

import { auth } from "@/app/(root)/user/(auth)/auth";

export async function isAdmin() {
	const sesion = await auth();
	return sesion?.user?.role === "ADMIN";
}

export async function isVerified() {
	const sesion = await auth();
	return sesion?.user?.role !== "UNAPPROVED";
}
