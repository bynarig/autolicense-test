import { toast } from "sonner";
import { QuestionType } from "@/types";
import {
	CACHE_EXPIRY,
	manageCacheSize,
} from "@/split/client/services/cache.service";

// Cache for storing search results
const searchCache = new Map<
	string,
	{ data: QuestionType[]; totalCount: number; timestamp: number }
>();

/**
 * Validates and determines the type of search input for questions
 * @param inputUnedited - The raw search input string
 * @returns The determined type of input: "id" or "name"
 */
function validateQuestionInput(inputUnedited: string): "id" | "name" {
	const input = inputUnedited.toLocaleLowerCase().trim();
	if (input.length === 24) {
		return "id";
	}
	return "name";
}

/**
 * Fetches questions based on search criteria with caching
 * @param searchTerm - The search term to filter questions
 * @param page - The page number for pagination
 * @param limit - The number of items per page
 * @returns Promise with array of questions and pagination info
 */
export async function fetchQuestions(
	searchTerm: string = "",
	page: number = 1,
	limit: number = 10,
): Promise<{ questions: QuestionType[]; totalCount: number }> {
	const cacheKey = `questions:${searchTerm}:${page}:${limit}`;

	const cachedResult = searchCache.get(cacheKey);
	const now = Date.now();

	if (cachedResult && now - cachedResult.timestamp < CACHE_EXPIRY) {
		return {
			questions: cachedResult.data,
			totalCount: cachedResult.totalCount,
		};
	}

	try {
		const dataToSend = {
			data: { search: searchTerm },
			inputType: validateQuestionInput(searchTerm),
			pagination: { page, limit },
		};

		let res;
		if (searchTerm.length === 0) {
			res = await fetch("/api/admin/tests/questions", {
				method: "POST",
				body: JSON.stringify(dataToSend),
				headers: { "Content-Type": "application/json" },
			});
		} else {
			res = await fetch("/api/admin/tests/questions/search", {
				method: "POST",
				body: JSON.stringify(dataToSend),
				headers: { "Content-Type": "application/json" },
			});
		}

		if (res.status === 200) {
			const json = await res.json();

			// Only show toast for manual searches, not for automatic ones
			if (page === 1) {
				toast("Questions fetched successfully");
			}

			searchCache.set(cacheKey, {
				data: json.data,
				totalCount: json.totalCount || json.data.length,
				timestamp: now,
			});

			manageCacheSize(searchCache);

			return {
				questions: json.data,
				totalCount: json.totalCount || json.data.length,
			};
		} else {
			const json = await res.json();
			toast(
				`Failed to get questions. err code: ${res.status} errmsg: ${json.error}`,
			);
			return { questions: [], totalCount: 0 };
		}
	} catch (error) {
		console.error("Error fetching questions:", error);
		toast(
			`Failed to get questions. Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
		return { questions: [], totalCount: 0 };
	}
}
