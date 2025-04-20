import Link from "next/link";
import Image from "next/image";

export default function Hero() {
	return (
		<div className="hero bg-base-200 min-h-screen">
			<div className="hero-content flex-col lg:flex-row-reverse">
				<Image
					src="https://s1.it.atcdn.net/wp-content/uploads/2015/05/Cliffs-of-Moher-Wild-Atlantic-Way-800x600.jpg"
					width={400}
					height={300}
					className="max-w-sm rounded-lg shadow-2xl"
					alt="Cliffs of Moher in Ireland"
				/>
				<div>
					<h1 className="text-5xl font-bold">Ireland FAQ</h1>
					<p className="py-6">
						Ireland FAQ is an information platform that provides
						quick and easy answers to the most common questions
						about living, working, studying, immigration and
						traveling in Ireland. It is your personal guide to the
						country - in Ukrainian, Russian or English. You can also
						take the Irish driving license test here. Unlike the
						official website, where the cost is €15, our
						subscription costs only €10 - more convenient, cheaper
						and with support in your language.
					</p>
					<Link className="btn btn-primary" href="/categories">
						Explore
					</Link>
				</div>
			</div>
		</div>
	);
}
