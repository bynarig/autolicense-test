"use client";

import { toast } from "sonner";
import axiosInstance from "@client/lib/axios";
import { useUserStore } from "@client/store/userStore";

export async function clientSignOut(callbackUrl: string = "/") {
	const res = await fetch("/api/auth/logout", {
		method: "POST",
		body: JSON.stringify(callbackUrl),
		headers: { "Content-Type": "application/json" },
	});
	if (res.status === 200) {
		useUserStore.getState().logout();
		toast("Successfully signed out.");
	} else {
		toast("Failed to sign out.");
	}
	return res;
}

export async function clientSignIn(data: { email: string; password: string }) {
	const res = await axiosInstance.post("auth/login", data);
	if (res.status === 200) {
		const { name, username, id, role, email, avatarUrl } = res.data.user;
		useUserStore
			.getState()
			.login({ name, username, role, avatarUrl, id, email });
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
