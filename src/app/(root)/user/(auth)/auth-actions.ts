"use client";

import { toast } from "sonner";

export async function clientSignOut(callbackUrl: string = "/") {
	const res = await fetch("/api/auth/logout", {
		method: "POST",
		body: JSON.stringify(callbackUrl),
		headers: { "Content-Type": "application/json" },
	});
	if (res.status === 200) {
		toast("Successfully signed out.");
	} else {
		toast("Failed to sign out.");
	}
	return res;
}

export async function clientSignIn(data: { email: string; password: string }) {
	const res = await fetch("/api/auth/login", {
		method: "POST",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	});
	if (res.status === 200) {
		toast("Successfully logged in.");
	} else {
		toast("Failed to log in.");
	}
	return res;
}

export async function clientRegister(data: {
	email: string;
	password: string;
}) {
	toast("Event has been created.");

	const res = await fetch("/api/auth/register", {
		method: "POST",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	});
	if (res.status === 200) {
		toast("Successfully registered.");
	} else {
		toast("Failed to register.");
	}
	return res;
}
