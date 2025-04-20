import Navbar from "@/shared/ui/basics/navbar/Navbar";
import Footer from "@/shared/ui/basics/Footer";

export default function Page() {
	return (
		<>
			<Navbar />
			<div className="justify-center flex">
				<h1 className="text-7xl ">Why Us?</h1>
			</div>

			<div className="flex w-full flex-col lg:flex-row mt-40 mb-40">
				<div className="card bg-base-300 rounded-box grid h-52 grow place-items-center">
					reason 1
				</div>
				<div className="divider lg:divider-horizontal"></div>
				<div className="card bg-base-300 rounded-box grid h-52 grow place-items-center">
					reason 2
				</div>
				<div className="divider lg:divider-horizontal"></div>
				<div className="card bg-base-300 rounded-box grid h-52 grow place-items-center">
					reason 3
				</div>
			</div>
			<Footer />
		</>
	);
}
