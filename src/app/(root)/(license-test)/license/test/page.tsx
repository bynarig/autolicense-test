"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestCard from "@/components/TestCard";

export default function Page() {
	return (
		<>
			<Navbar />
			<div className="flex justify-center">
				<div className="">
					<TestCard />
				</div>
			</div>
			<Footer />
		</>
	);
}
