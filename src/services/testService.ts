import { toast } from "sonner";

interface Test {
	id: string;
	title: string;
	authorId: string;
	createdAt?: Date;
	author?: {
		name?: string;
		id?: string;
	};
	timeCompleted?: number;
	[key: string]: any;
}

// Cache for storing search results
const searchCache = new Map<
	string,
	{ data: Test[]; totalCount: number; timestamp: number }
>();
const CACHE_EXPIRY = 60000; // Cache expires after 1 minute
const MAX_CACHE_SIZE = 100; // Maximum number of entries in the cache

/**
 * Manages the cache size by removing the oldest entries when the cache exceeds the maximum size
 */
function manageCacheSize(): void {
	if (searchCache.size > MAX_CACHE_SIZE) {
		// Get all cache entries and sort them by timestamp (oldest first)
		const entries = Array.from(searchCache.entries()).sort(
			(a, b) => a[1].timestamp - b[1].timestamp,
		);

		// Remove the oldest entries until we're under the limit
		const entriesToRemove = entries.slice(
			0,
			entries.length - MAX_CACHE_SIZE,
		);
		for (const [key] of entriesToRemove) {
			searchCache.delete(key);
		}
	}
}

/**
 * Validates and determines the type of search input for tests
 * @param inputUnedited - The raw search input string
 * @returns The determined type of input: "id" or "name"
 */
function validateTestInput(inputUnedited: string): "id" | "name" {
	const input = inputUnedited.toLocaleLowerCase().trim();
	if (input.length === 24) {
		return "id";
	}
	return "name";
}

/**
 * Fetches tests based on search criteria with caching
 * @param searchTerm - The search term to filter tests
 * @param page - The page number for pagination
 * @param limit - The number of items per page
 * @returns Promise with array of tests and pagination info
 */
export async function fetchTests(
	searchTerm: string = "",
	page: number = 1,
	limit: number = 10,
): Promise<{ tests: Test[]; totalCount: number }> {
	// Create a cache key based on the search parameters
	const cacheKey = `tests:${searchTerm}:${page}:${limit}`;

	// Check if we have a valid cached result
	const cachedResult = searchCache.get(cacheKey);
	const now = Date.now();

	if (cachedResult && now - cachedResult.timestamp < CACHE_EXPIRY) {
		// Return cached data if it's still valid
		return {
			tests: cachedResult.data,
			totalCount: cachedResult.totalCount,
		};
	}

	// If no valid cache, proceed with API call
	try {
		const dataToSend = {
			data: { search: searchTerm },
			inputType: validateTestInput(searchTerm),
			pagination: { page, limit },
		};

		let res;
		if (searchTerm.length === 0) {
			res = await fetch("/api/admin/tests", {
				method: "POST",
				body: JSON.stringify(dataToSend),
				headers: { "Content-Type": "application/json" },
			});
		} else {
			res = await fetch("/api/admin/tests/search", {
				method: "POST",
				body: JSON.stringify(dataToSend),
				headers: { "Content-Type": "application/json" },
			});
		}

		if (res.status === 200) {
			const json = await res.json();

			// Only show toast for manual searches, not for automatic ones
			if (page === 1) {
				toast("Tests fetched successfully");
			}

			// Cache the result
			searchCache.set(cacheKey, {
				data: json.data,
				totalCount: json.totalCount || json.data.length,
				timestamp: now,
			});

			// Manage cache size after adding new entry
			manageCacheSize();

			return {
				tests: json.data,
				totalCount: json.totalCount || json.data.length,
			};
		} else {
			const json = await res.json();
			toast(
				`Failed to get tests. err code: ${res.status} errmsg: ${json.error}`,
			);
			return { tests: [], totalCount: 0 };
		}
	} catch (error) {
		// Handle network errors or other exceptions
		console.error("Error fetching tests:", error);
		toast(
			`Failed to get tests. Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
		return { tests: [], totalCount: 0 };
	}
}
