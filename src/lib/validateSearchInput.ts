import { searchSchema } from "@/validators/zod";

/**
 * Validates and determines the type of search input
 * @param inputUnedited - The raw search input string
 * @returns The determined type of input: "id", "email", "role", or "name"
 */
export function validateSearchInput(
	inputUnedited: string,
): "id" | "email" | "role" | "name" {
	const input = inputUnedited.toLocaleLowerCase().trim();

	if (input.length === 24) {
		return "id";
	}

	if (searchSchema.safeParse(input).success) {
		return "email";
	}

	if (input === "admin" || input === "unapproved" || input === "user") {
		return "role";
	}

	return "name";
}
