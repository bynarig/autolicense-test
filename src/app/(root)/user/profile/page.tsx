"use client";

import Navbar from "@/shared/ui/basics/navbar/Navbar";
import Footer from "@/shared/ui/basics/Footer";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		// Only redirect if we're definitely not authenticated (not during loading)
		if (status === "unauthenticated") {
			router.push("/user/login");
		}
	}, [status, router]);

	// Show loading state while session is being determined
	if (status === "loading") {
		return (
			<>
				<Navbar />
				<div>Checking authentication...</div>
				<Footer />
			</>
		);
	}

	return (
		<>
			<Navbar />
			{session && session.user ? (
				<Suspense fallback={<div>Loading...</div>}>
					<div>
						<div className="avatar">
							<div className="w-24 rounded-xl">
								<img
									src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
									alt="User avatar"
									width={24}
									height={24}
								/>
							</div>
							<p className="text-7xl">Hi, {session.user.name}</p>
							<p className="text-5xl">
								Account role: {session.user.role}
							</p>
							<p className="text-5xl">
								Account edited:{" "}
								{session.user.editedAt || "never"}
							</p>
							<Link className="btn" href="/license/test">
								Go to test system
							</Link>
						</div>
					</div>
				</Suspense>
			) : (
				<div>login to view info</div>
			)}
			<Footer />
		</>
	);
}
