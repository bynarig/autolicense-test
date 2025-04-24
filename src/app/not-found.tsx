import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Page Not Found | LII",
	description: "The page you are looking for does not exist.",
};

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
			<div className="max-w-md text-center">
				<h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
					404
				</h1>
				<h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
					Page Not Found
				</h2>
				<p className="text-gray-600 dark:text-gray-400 mb-8">
					The page you are looking for doesn&apos;t exist or has been
					moved.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button asChild variant="default" className="px-6 py-3">
						<Link href="/">Go to Home</Link>
					</Button>
					<Button asChild variant="outline" className="px-6 py-3">
						<Link href="/adminpanel">Go to Admin Panel</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
