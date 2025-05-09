"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PricingCard } from "@/components/PricingCard";

export default function Page() {
	// Define features for each plan
	const basicFeatures = [
		{ included: true, text: "5 practice tests per month" },
		{ included: true, text: "Basic question bank access" },
		{ included: true, text: "Standard test simulations" },
		{ included: true, text: "Progress tracking" },
		{ included: false, text: "Personalized study plans" },
		{ included: false, text: "Advanced analytics" },
		{ included: false, text: "Priority support" },
	];

	const proFeatures = [
		{ included: true, text: "Unlimited practice tests" },
		{ included: true, text: "Full question bank access" },
		{ included: true, text: "Advanced test simulations" },
		{ included: true, text: "Detailed progress tracking" },
		{ included: true, text: "Personalized study plans" },
		{ included: false, text: "Advanced analytics" },
		{ included: false, text: "Priority support" },
	];

	return (
		<>
			<Navbar />

			<div className=" container mx-auto px-4 py-16 sm:py-24  md:h-[calc(100vh-64px)] place-content-center">
				{/* Header section */}
				<div className="text-center mb-16">
					<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
						Simple, Transparent Pricing
					</h1>
					<p className="mt-6 max-w-2xl mx-auto text-xl text-muted-foreground">
						Choose the perfect plan to cover your needs.
					</p>
				</div>

				<div className="flex-col-reverse flex md:grid  md:grid-cols-2 gap-8 max-w-7xl mx-auto">
					<PricingCard
						title="Basic"
						price="0"
						description="Perfect for beginners getting started with test preparation"
						features={basicFeatures}
						buttonText="Get Started"
						disabled={true}
					/>

					<PricingCard
						title="Pro"
						price="10"
						description="Everything you need to pass your test with confidence"
						features={proFeatures}
						buttonText="Subscribe Now"
						popular={true}
					/>
				</div>
			</div>

			<Footer />
		</>
	);
}
