export default function TestCard() {
	return (
		<>
			<div className="card bg-base-100 w-140 shadow-sm">
				<figure>
					{/*<Image*/}
					{/*	src="https://www.tintmyridedenver.com/wp-content/uploads/denver-auto-show.jpg"*/}
					{/*	alt="Shoes"*/}
					{/*/>*/}
				</figure>
				<div className="card-body">
					<div className="flex justify-between">
						<h2 className="card-title">question 1</h2>
						<button className="btn btn-ghost">categories</button>
					</div>
					<p>
						Lorem Ipsum is simply dummy text of the printing and
						typesetting industry. Lorem Ipsum has been the
						industry&#39;s standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and
						scrambled it to make a type specimen book. It has
						survived not only five centuries,
					</p>
					<button className="btn btn-primary">
						Pretty big text with answer 1
					</button>
					<button className="btn btn-primary">
						Pretty big text with answer 2
					</button>
					<button className="btn btn-primary">
						Pretty big text with answer 3
					</button>
					<button className="btn btn-primary">
						Pretty big text with answer 4
					</button>
				</div>
			</div>
		</>
	);
}
