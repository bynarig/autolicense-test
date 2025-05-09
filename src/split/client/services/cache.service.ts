"use client";

export const CACHE_EXPIRY = 60000; // Cache expires after 1 minute
export const MAX_CACHE_SIZE = 100; // Maximum number of entries in the cache

/**
 * Manages the cache size by removing the oldest entries when the cache exceeds the maximum size
 */
export function manageCacheSize(passedCache: any): void {
	if (passedCache.size > MAX_CACHE_SIZE) {
		// Define the type for cache entries, assuming each value has a timestamp
		const entries = Array.from(
			passedCache.entries() as Array<[unknown, { timestamp: number }]>,
		);
		// Sort entries by timestamp (oldest first)
		entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

		// Calculate entries to remove to stay under the limit
		const entriesToRemove = entries.slice(
			0,
			entries.length - MAX_CACHE_SIZE,
		);
		for (const [key] of entriesToRemove) {
			passedCache.delete(key);
		}
	}
}
