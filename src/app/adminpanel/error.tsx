"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error("Unhandled error in admin panel:", error);
	}, [error]);

	return (
		<div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
			<div className="max-w-md text-center">
				<h2 className="text-2xl font-bold text-red-600 mb-4">
					Something went wrong!
				</h2>
				<p className="text-gray-600 dark:text-gray-400 mb-6">
					{error.message ||
						"An unexpected error occurred in the admin panel."}
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button onClick={() => reset()} variant="default">
						Try again
					</Button>
					<Button
						onClick={() => (window.location.href = "/adminpanel")}
						variant="outline"
					>
						Go to Dashboard
					</Button>
				</div>
			</div>
		</div>
	);
}
