import { getSession } from "next-auth/react";

export async function getSessionWrapper() {
	return await getSession();
}
