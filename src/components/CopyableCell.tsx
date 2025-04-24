import React from "react";
import { Button } from "@/components/ui/button";

interface CopyableCellProps {
	value: string | number | null | undefined | Date;
	formatter?: (value: any) => string;
	className?: string;
}

/**
 * A reusable component for table cells with copy-to-clipboard functionality
 */
export function CopyableCell({
	value,
	formatter,
	className = "",
}: CopyableCellProps) {
	const displayValue =
		value !== null && value !== undefined
			? formatter
				? formatter(value)
				: String(value)
			: "—";

	const copyValue = displayValue === "—" ? "" : displayValue;

	return (
		<Button
			variant="ghost"
			className={`copy-btn ${className}`}
			data-clipboard-text={copyValue}
		>
			{displayValue}
		</Button>
	);
}
