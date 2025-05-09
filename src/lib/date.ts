import {
	format,
	formatDistanceToNow,
	isThisYear,
	isToday,
	isYesterday,
} from "date-fns";

/**
 * Convert a date to a pretty, human-readable format using date-fns
 * @param {Date|string|number} date - Input date (Date object, ISO string, or timestamp)
 * @param {Object} [options] - Formatting options
 * @param {boolean} [options.includeTime=false] - Whether to include the time
 * @returns {string} Formatted date string
 */
export function toPrettyDate(
	date: string | number | Date,
	{ includeTime = true } = {},
) {
	const dateObj = new Date(date);

	// Handle invalid dates
	if (isNaN(dateObj.getTime())) {
		return "Invalid date";
	}

	let datePart;

	if (isToday(dateObj)) {
		datePart = "Today";
	} else if (isYesterday(dateObj)) {
		datePart = "Yesterday";
	} else if (isThisYear(dateObj)) {
		// Format as "Month Day" for current year (e.g., "May 9")
		datePart = format(dateObj, "MMMM d");
	} else {
		// Format as "Month Day, Year" for previous years (e.g., "May 9, 2023")
		datePart = format(dateObj, "MMMM d, yyyy");
	}

	if (!includeTime) {
		return datePart;
	}

	// Add time part (e.g., "3:30 PM")
	const timePart = format(dateObj, "h:mm a");
	return `${datePart} at ${timePart}`;
}

// Alternative version that shows relative time (e.g., "2 days ago")
export function toRelativeDate(date: string | number | Date) {
	const dateObj = new Date(date);

	if (isNaN(dateObj.getTime())) {
		return "Invalid date";
	}

	return formatDistanceToNow(dateObj, { addSuffix: true });
}
