"use client";

import Link from "next/link";
import Image from "next/image";

export default function Hero() {
	return (
		<section className="relative bg-background min-h-screen flex items-center py-16">
			{/* Background pattern */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background z-0"></div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Content */}
					<div className="space-y-6 order-2 lg:order-1">
						<div className="space-y-2">
							<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
								<span className="text-primary">Ireland</span>{" "}
								FAQ
							</h1>
							<div className="h-1 w-20 bg-primary rounded-full"></div>
						</div>

						<p className="text-lg text-muted-foreground leading-relaxed">
							Ireland FAQ is an information platform that provides
							quick and easy answers to the most common questions
							about living, working, studying, immigration and
							traveling in Ireland.
						</p>

						<p className="text-muted-foreground leading-relaxed">
							It is your personal guide to the country - in
							Ukrainian, Russian or English. You can also take the
							Irish driving license test here. Unlike the official
							website, where the cost is €15, our subscription
							costs only €10 - more convenient, cheaper and with
							support in your language.
						</p>

						<div className="pt-4">
							<Link
								href="/categories"
								className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium shadow-lg hover:bg-primary/90 transition-colors duration-200"
							>
								Explore Ireland FAQ
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="ml-2 h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</Link>
						</div>
					</div>

					{/* Image */}
					<div className="relative order-1 lg:order-2">
						<div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
							<Image
								src="https://ireland-faq-storage.b-cdn.net/hardcoded/Cliffs-of-Moher-Wild-Atlantic-Way-800x600.jpeg"
								width={800}
								height={600}
								className="w-full h-auto object-cover"
								alt="Cliffs of Moher in Ireland"
								priority
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
							<div className="absolute bottom-4 left-4 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
								Cliffs of Moher, Ireland
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
