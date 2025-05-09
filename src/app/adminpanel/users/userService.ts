import { toast } from "sonner";
import { validateSearchInput } from "@/validators/validateSearchInput";
import { fetchUsersServer } from "@/app/adminpanel/users/serverActions";
import { UserType } from "@/types";
import {
	CACHE_EXPIRY,
	manageCacheSize,
} from "@/split/client/services/cache.service";

// Cache for storing search results
const searchCache = new Map<
	string,
	{ data: UserType[]; totalCount: number; timestamp: number }
>();

/**
 * Fetches users based on search criteria with caching
 * Uses server actions when possible for better performance
 * Falls back to API routes when server actions are not available
 *
 * @param searchTerm - The search term to filter users
 * @param page - The page number for pagination
 * @param limit - The number of items per page
 * @returns Promise with array of users and pagination info
 */
export async function fetchUsers(
	searchTerm: string = "",
	page: number = 1,
	limit: number = 10,
): Promise<{ users: UserType[]; totalCount: number }> {
	// Create a cache key based on the search parameters
	const cacheKey = `${searchTerm}:${page}:${limit}`;

	// Check if we have a valid cached result
	const cachedResult = searchCache.get(cacheKey);
	const now = Date.now();

	if (cachedResult && now - cachedResult.timestamp < CACHE_EXPIRY) {
		// Return cached data if it's still valid
		return {
			users: cachedResult.data,
			totalCount: cachedResult.totalCount,
		};
	}

	try {
		// Try to use server actions first (more efficient)
		const result = await fetchUsersServer(searchTerm, page, limit);

		// Only show toast for manual searches, not for automatic ones
		if (page === 1) {
			toast("Users fetched successfully");
		}

		// Cache the result
		searchCache.set(cacheKey, {
			data: result.users,
			totalCount: result.totalCount,
			timestamp: now,
		});

		// Manage cache size after adding new entry
		manageCacheSize(searchCache);

		return {
			users: result.users,
			totalCount: result.totalCount,
		};
	} catch (serverActionError) {
		console.error(
			"Server action failed, falling back to API route:",
			serverActionError,
		);

		// If server action fails, fall back to API route
		try {
			const dataToSend = {
				data: { search: searchTerm },
				inputType: validateSearchInput(searchTerm),
				pagination: { page, limit },
			};

			let res;
			if (searchTerm.length === 0) {
				res = await fetch("/api/admin/users", {
					method: "POST",
					body: JSON.stringify(dataToSend),
					headers: { "Content-Type": "application/json" },
				});
			} else {
				res = await fetch("/api/admin/users/search", {
					method: "POST",
					body: JSON.stringify(dataToSend),
					headers: { "Content-Type": "application/json" },
				});
			}

			if (res.status === 200) {
				const json = await res.json();

				// Only show toast for manual searches, not for automatic ones
				if (page === 1) {
					toast("Users fetched successfully");
				}

				// Cache the result
				searchCache.set(cacheKey, {
					data: json.data,
					totalCount: json.totalCount || json.data.length,
					timestamp: now,
				});

				// Manage cache size after adding new entry
				manageCacheSize(searchCache);

				return {
					users: json.data,
					totalCount: json.totalCount || json.data.length,
				};
			} else {
				const json = await res.json();
				toast(
					`Failed to get users. err code: ${res.status} errmsg: ${json.error}`,
				);
				return { users: [], totalCount: 0 };
			}
		} catch (apiError) {
			console.error("API route also failed:", apiError);
			toast(
				`Failed to get users. Network error: ${apiError instanceof Error ? apiError.message : "Unknown error"}`,
			);
			return { users: [], totalCount: 0 };
		}
	}
}
