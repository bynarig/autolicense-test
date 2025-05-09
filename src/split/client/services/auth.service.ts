"use client";

import { toast } from "sonner";
import { clearSessionCache } from "@/context/session-context";

export async function clientSignOut(callbackUrl: string = "/") {
	const res = await fetch("/api/auth/logout", {
		method: "POST",
		body: JSON.stringify(callbackUrl),
		headers: { "Content-Type": "application/json" },
	});
	if (res.status === 200) {
		toast("Successfully signed out.");
		// Clear all session data from localStorage
		clearSessionCache();
		// Redirect to the main page
		window.location.href = callbackUrl;
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

export async function clientRequestPasswordReset(data: { email: string }) {
	const res = await fetch("/api/auth/reset-password", {
		method: "POST",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	});
	if (res.status === 200) {
		toast("Password reset link sent to your email.");
	} else {
		toast("Failed to send password reset link.");
	}
	return res;
}

export async function clientResetPassword(data: {
	token: string;
	password: string;
}) {
	const res = await fetch("/api/auth/reset-password/confirm", {
		method: "POST",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	});
	if (res.status === 200) {
		toast("Password successfully reset.");
	} else {
		toast("Failed to reset password.");
	}
	return res;
}
