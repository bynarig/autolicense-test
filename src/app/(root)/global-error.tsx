"use client"; // Error boundaries must be Client Components

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html>
			<body>
				<h2>Something went wrong!</h2>
			</body>
		</html>
	);
}
