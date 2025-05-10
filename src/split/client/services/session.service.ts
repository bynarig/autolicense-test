"use client";

import { getSession } from "next-auth/react";

export function getSessionWrapper() {
	return getSession();
}
