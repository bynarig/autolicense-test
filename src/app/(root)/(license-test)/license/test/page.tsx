import React from "react";
import { LicenseTest } from "@/components/LicenseTest";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Car } from "lucide-react";

export const metadata: Metadata = {
	title: "Driver License Test | Life in Ireland",
	description:
		"Take a practice driver license test to prepare for your Irish driving license exam",
};

export default function Page() {
	return (
		<>
			<Navbar />
			<div className="container mx-auto py-6 px-4">
				<div className="max-w-3xl mx-auto">
					<div className="mb-6 text-center">
						<div className="flex items-center justify-center gap-2 mb-2">
							<Car className="h-6 w-6 text-primary" />
							<h1 className="text-2xl font-bold">
								Driver License Practice Test
							</h1>
						</div>
						<p className="text-muted-foreground text-sm max-w-xl mx-auto">
							Test your knowledge of Irish driving rules and
							regulations with this practice test. You need to
							score at least 80% to pass.
						</p>
					</div>

					<div className="bg-card rounded-lg shadow-md p-4">
						<LicenseTest />
					</div>

					<div className="mt-6 text-xs text-muted-foreground bg-muted/30 p-3 rounded-md">
						<p>
							This practice test is designed to help you prepare
							for the official Irish driver theory test. The
							questions are similar to those you might encounter
							in the actual test.
						</p>
						<p className="mt-1">
							Remember that passing this practice test does not
							guarantee you will pass the official test. Continue
							studying the Rules of the Road and other official
							materials.
						</p>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
