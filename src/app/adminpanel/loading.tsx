export default function Loading() {
	return (
		<div className="flex items-center justify-center min-h-[70vh]">
			<div className="flex flex-col items-center gap-4">
				<div className="h-12 w-12 rounded-full border-4 border-t-blue-500 border-b-blue-700 border-l-blue-600 border-r-blue-600 animate-spin"></div>
				<p className="text-lg font-medium text-gray-600 dark:text-gray-400">
					Loading admin panel...
				</p>
			</div>
		</div>
	);
}
