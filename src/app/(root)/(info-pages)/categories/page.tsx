import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Page() {
	return (
		<>
			<Navbar />
			<div className="ml-0 md:ml-14">
				<h2 className="text-7xl ">Categories</h2>
				<h3 className="text-4xl md:ml-3 mt-4">info pages</h3>
				<div className="flex flex-col items-start gap-2 md:ml-8 mt-4">
					<Link className="btn btn-primary w-fit" href="/feedback">
						feedback
					</Link>
					<Link className="btn btn-primary w-fit" href="/why-us">
						why us
					</Link>
					<Link
						className="btn btn-primary w-fit"
						href="/how-to-get-license"
					>
						how-to-get-license
					</Link>
					<Link className="btn btn-primary w-fit" href="/about-cars">
						about-cars
					</Link>
					<Link className="btn btn-primary w-fit" href="/business">
						business
					</Link>
					<Link className="btn btn-primary w-fit" href="/education">
						education
					</Link>
					<Link
						className="btn btn-primary w-fit"
						href="/life-in-ireland"
					>
						life-in-ireland
					</Link>
					<Link className="btn btn-primary w-fit" href="/work">
						work
					</Link>
				</div>
			</div>
			<Footer />
		</>
	);
}
