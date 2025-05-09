"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Page() {
	return (
		<>
			<Navbar />
			<div className="flex justify-center h-140 mt-70">
				<div className="card bg-base-100 w-96 shadow-sm">
					<div className="flex justify-center">
						<h1 className="text-6xl">Reset</h1>
					</div>
					<div className="card-body">
						<input
							type="text"
							placeholder="Your mail or username"
							className="input"
						/>
						<button className="btn">Send</button>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
