"use client";

import { useSessionWrapper } from "@/context/session-context";
import { useRouter } from "next/navigation";

export default function AdminStrict() {
	const { data: session, status } = useSessionWrapper();
	const router = useRouter();

	if (status === "loading") {
		return <div></div>;
	}
	if (!session || session.user.role !== "ADMIN") {
		if (typeof window !== "undefined") {
			router.replace("/");
		}
		return <div></div>;
	}

	return <></>;
}
