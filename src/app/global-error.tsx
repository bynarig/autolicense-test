"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Global application error:", error);
	}, [error]);

	return (
		<html lang="en">
			<body>
				<div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
					<div className="max-w-md text-center">
						<h1 className="text-4xl font-bold text-red-600 mb-4">
							Something went wrong!
						</h1>
						<p className="text-gray-600 dark:text-gray-400 mb-6">
							{error.message ||
								"An unexpected error occurred in the application."}
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button
								onClick={() => reset()}
								variant="default"
								className="px-6 py-3 text-lg"
							>
								Try again
							</Button>
							<Button
								onClick={() => (window.location.href = "/")}
								variant="outline"
								className="px-6 py-3 text-lg"
							>
								Go to Home
							</Button>
						</div>
						<p className="mt-8 text-sm text-gray-500 dark:text-gray-600">
							If the problem persists, please contact support.
						</p>
					</div>
				</div>
			</body>
		</html>
	);
}
