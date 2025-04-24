"use server";

import sharp from "sharp";
import { randomUUID } from "crypto";
import bunnyStorage from "./image-cdn";
import imageUrl from "./image-url";

interface ImageUploadOptions {
	width?: number;
	quality?: number;
	folder?: string;
}

// Create the ImageService class as before, but don't export it directly
class ImageService {
	private readonly defaultOptions: Required<ImageUploadOptions> = {
		width: 800, // Default width for images
		quality: 80, // Default quality for JPEG images
		folder: "images", // Default folder in storage
	};

	/**
	 * Generate a unique filename for an image
	 * @param originalFilename Original filename to extract extension
	 * @returns A unique filename with original extension
	 */
	private generateUniqueFilename(originalFilename: string): string {
		const extension = originalFilename.split(".").pop() || "jpg";
		const uuid = randomUUID();
		return `${uuid}.${extension}`;
	}

	/**
	 * Process an image with sharp (resize, optimize)
	 * @param buffer Original image buffer
	 * @param options Processing options
	 * @returns Processed image buffer
	 */
	private async processImage(
		buffer: Buffer,
		options: Required<ImageUploadOptions>,
	): Promise<Buffer> {
		const { width, quality } = options;

		return sharp(buffer)
			.resize(width, null, {
				withoutEnlargement: true, // Don't enlarge images smaller than target width
				fit: "inside",
			})
			.jpeg({ quality }) // Convert to JPEG with specified quality
			.toBuffer();
	}

	/**
	 * Upload an image to storage with processing
	 * @param file File to upload
	 * @param options Upload options
	 * @returns Path to the uploaded file (without domain)
	 */
	async uploadImage(
		file: File,
		options?: Partial<ImageUploadOptions>,
	): Promise<string> {
		const mergedOptions = { ...this.defaultOptions, ...options };
		const buffer = Buffer.from(await file.arrayBuffer());

		// Process the image
		const processedBuffer = await this.processImage(buffer, mergedOptions);

		// Generate a unique filename
		const filename = this.generateUniqueFilename(file.name);

		// Create the path
		const filePath = `${mergedOptions.folder}/${filename}`;

		// Upload to storage
		await bunnyStorage.upload(processedBuffer, filePath);

		// Return only the path (without domain)
		return filePath;
	}

	/**
	 * Delete an image from storage
	 * @param path Path to the image (without domain)
	 */
	async deleteImage(path: string): Promise<void> {
		await bunnyStorage.delete(path);
	}

	/**
	 * Get the full URL for an image path
	 * @param path Image path without domain
	 * @returns Full CDN URL
	 */
	async getImageUrl(path: string): Promise<string> {
		return imageUrl.getImageUrl(path);
	}

	/**
	 * Extract path from a full CDN URL
	 * @param url Full CDN URL
	 * @returns Path without domain or null if not a valid CDN URL
	 */
	async extractPathFromUrl(url: string): Promise<string | null> {
		return imageUrl.extractPathFromUrl(url);
	}
}

// Create a singleton instance for internal use
const imageService = new ImageService();

// Export async functions that use the imageService instance
export async function uploadImage(
	file: File,
	options?: Partial<ImageUploadOptions>,
): Promise<string> {
	return imageService.uploadImage(file, options);
}

export async function deleteImage(path: string): Promise<void> {
	return imageService.deleteImage(path);
}

export async function getImageUrl(path: string): Promise<string> {
	return imageService.getImageUrl(path);
}

export async function extractPathFromUrl(url: string): Promise<string | null> {
	return imageService.extractPathFromUrl(url);
}
