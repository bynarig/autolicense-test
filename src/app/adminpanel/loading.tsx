export default function Loading() {
	return (
		<div className="flex items-center justify-center min-h-[70vh]">
			<div className="flex flex-col items-center gap-4">
				<div className="h-12 w-12 rounded-full border-4 border-t-purple-500 border-b-purple-700 border-l-purple-600 border-r-purple-600 animate-spin"></div>
				{/*<p className="text-lg font-medium text-gray-600 dark:text-gray-400">*/}
				{/*	Loading admin panel...*/}
				{/*</p>*/}
			</div>
		</div>
	);
}
