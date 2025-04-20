"use client";

import Navbar from "@/shared/ui/basics/navbar/Navbar";
import Footer from "@/shared/ui/basics/Footer";
import TestCard from "@/shared/ui/testing/TestCard";

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
