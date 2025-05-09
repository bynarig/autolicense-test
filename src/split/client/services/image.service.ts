"use client";

import { toast } from "sonner";

/**
 * Client-side image upload function that uses the server API
 * @param file The file to upload
 * @param options Optional parameters for the upload
 * @returns The path to the uploaded image
 */
export async function uploadImage(
	file: File,
	options?: { width?: number },
): Promise<string> {
	try {
		const formData = new FormData();
		formData.append("file", file);

		// Add width parameter to URL if provided
		let url = "/api/storage/upload";
		if (options?.width) {
			url += `?width=${options.width}`;
		}

		const response = await fetch(url, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Failed to upload image");
		}

		const data = await response.json();
		return data.path;
	} catch (error) {
		console.error("Error uploading image:", error);
		toast.error("Failed to upload image");
		throw error;
	}
}

/**
 * Get the full URL for an image path
 * @param path The path to the image
 * @returns The full URL to the image
 */
export function getImageUrl(path: string): string {
	// Check if it's already a full URL
	if (path.startsWith("http")) {
		return path;
	}

	// Use the CDN URL from environment or a default
	const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "https://cdn.example.com";
	return `${cdnUrl}/${path}`;
}

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
		const cdnDomain = process.env.NEXT_PUBLIC_BUNNYCDN_STORAGE_ZONE_NAME;

		// If CDN domain is not set, return a placeholder or the path itself
		if (!cdnDomain) {
			console.warn(
				"NEXT_PUBLIC_BUNNYCDN_STORAGE_ZONE_NAME is not set. Image URLs may not work correctly.",
			);
			// Return the path as is, which will be relative to the current domain
			// This allows images to still work in development if they're served from the same domain
			return path;
		}

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
		const cdnDomain = process.env.NEXT_PUBLIC_BUNNYCDN_STORAGE_ZONE_NAME;

		// If CDN domain is not set, we can't extract the path
		if (!cdnDomain) {
			console.warn(
				"NEXT_PUBLIC_BUNNYCDN_STORAGE_ZONE_NAME is not set. Cannot extract path from URL.",
			);
			return null;
		}

		const cdnPattern = `${cdnDomain}.b-cdn.net/`;
		const index = url.indexOf(cdnPattern);

		if (index === -1) return null;

		return url.substring(index + cdnPattern.length);
	},
};

export default imageUrl;
