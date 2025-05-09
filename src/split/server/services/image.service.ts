"use server";

"use server";

import sharp from "sharp";
import { randomUUID } from "crypto";
import "dotenv/config";
import BunnyStorage from "bunnycdn-storage-ts";
import imageUrl from "@/split/client/services/image.service";

interface ImageUploadOptions {
	width?: number;
	quality?: number;
	folder?: string;
}

const defaultOptions: Required<ImageUploadOptions> = {
	width: 800,
	quality: 80,
	folder: "images", // Default folder in storage
};
const BunnyStorageInstance = new BunnyStorage(
	process.env.BUNNYCDN_API_KEY || "",
	process.env.BUNNYCDN_STORAGE_ZONE_NAME || "",
);

export async function generateUniqueFilename(
	originalFilename: string,
): Promise<string> {
	const extension = originalFilename.split(".").pop() || "jpg";
	const uuid = randomUUID();
	return `${uuid}.${extension}`;
}

//Image optimmisation and preparation for publishing
export async function processImage(
	buffer: Buffer,
	options: Required<ImageUploadOptions>,
): Promise<Buffer> {
	const { width, quality } = options;

	return sharp(buffer)
		.resize(width, null, {
			withoutEnlargement: true,
			fit: "inside",
		})
		.jpeg({ quality })
		.toBuffer();
}

export async function uploadImage(
	file: File,
	options?: Partial<ImageUploadOptions>,
): Promise<string> {
	const mergedOptions = { ...defaultOptions, ...options };
	const buffer = Buffer.from(await file.arrayBuffer());

	const processedBuffer = await processImage(buffer, mergedOptions);

	const filename = await generateUniqueFilename(file.name);

	const filePath = `${mergedOptions.folder}/${filename}`;

	await BunnyStorageInstance.upload(processedBuffer, filePath);

	return filePath;
}

export async function deleteImage(path: string): Promise<void> {
	await BunnyStorageInstance.delete(path);
}

export async function getImageUrl(path: string): Promise<string> {
	return imageUrl.getImageUrl(path);
}

export async function extractPathFromUrl(url: string): Promise<string | null> {
	return imageUrl.extractPathFromUrl(url);
}
