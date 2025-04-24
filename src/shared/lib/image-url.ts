// Client-safe module for image URL handling
// This module doesn't use any Node.js-specific APIs and is safe to use in client components

/**
 * Utility functions for handling image URLs
 * This is a client-safe version that doesn't import any Node.js modules
 */
const imageUrl = {
	/**
	 * Get the full URL for an image path
	 * @param path Image path without domain
	 * @returns Full CDN URL
	 */
	getImageUrl(path: string): string {
		// If it's already a full URL, return it as is
		if (path.startsWith("http")) {
			return path;
		}

		// Use environment variable for CDN domain
		// In client components, this will use the NEXT_PUBLIC_ prefixed variable
		const cdnDomain =
			process.env.NEXT_PUBLIC_BUNNYCDN_STORAGE_ZONE_NAME || "";
		return `https://${cdnDomain}.b-cdn.net/${path}`;
	},

	/**
	 * Extract path from a full CDN URL
	 * @param url Full CDN URL
	 * @returns Path without domain or null if not a valid CDN URL
	 */
	extractPathFromUrl(url: string): string | null {
		if (!url) return null;

		// Use environment variable for CDN domain
		const cdnDomain = `${process.env.NEXT_PUBLIC_BUNNYCDN_STORAGE_ZONE_NAME}.b-cdn.net/`;
		const index = url.indexOf(cdnDomain);

		if (index === -1) return null;

		return url.substring(index + cdnDomain.length);
	},
};

export default imageUrl;
