"use server";

import { auth } from "@server/config/auth-js";

export async function isAdmin() {
	const sesion = await auth();
	return sesion?.user?.role === "ADMIN";
}

export async function isVerified() {
	const sesion = await auth();
	return sesion?.user?.role !== "UNAPPROVED";
}
