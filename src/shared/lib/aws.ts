// src/shared/lib/aws.ts
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Initialize S3 client
const s3Client = new S3Client({
	region: process.env.AWS_REGION || "eu-central-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
	},
});

const bucketName = process.env.AWS_S3_BUCKET || "irelandfaq";

/**
 * Checks if a file is an image based on its MIME type
 * @param file The file to check
 * @returns Boolean indicating if the file is an image
 */
export const isImage = (file: File): boolean => {
	const acceptedImageTypes = [
		"image/jpeg",
		"image/png",
		"image/gif",
		"image/webp",
		"image/svg+xml",
		"image/bmp",
		"image/tiff",
	];

	return file && acceptedImageTypes.includes(file.type);
};

/**
 * Uploads an image to AWS S3 and returns the link
 * @param file The image file to upload
 * @returns Promise resolving to the S3 link or null if upload failed
 */
export const uploadToS3 = async (file: File): Promise<string | null> => {
	try {
		// Check if file is an image
		if (!isImage(file)) {
			throw new Error("File is not a valid image");
		}

		// Check if credentials are available
		if (
			!process.env.AWS_ACCESS_KEY_ID ||
			!process.env.AWS_SECRET_ACCESS_KEY ||
			!bucketName
		) {
			console.error("AWS credentials or bucket name are missing");
			throw new Error("AWS S3 credentials not configured");
		}

		// Generate a unique key for the file
		const fileExtension = file.name.split(".").pop();
		const uniqueKey = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;

		// Convert file to ArrayBuffer
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Upload to S3
		const command = new PutObjectCommand({
			Bucket: bucketName,
			Key: uniqueKey,
			Body: buffer,
			ContentType: file.type,
			ACL: "public-read", // Make the file publicly accessible
		});

		await s3Client.send(command);

		// Construct the URL to the uploaded file
		return `https://${bucketName}.s3.${process.env.AWS_REGION || "eu-central-1"}.amazonaws.com/${uniqueKey}`;
	} catch (error: any) {
		console.error(
			"Error uploading to S3:",
			error instanceof Error ? error.message : error,
		);
		if (error.response) {
			console.error("API Response:", error.response.data);
		}
		return null;
	}
};

/**
 * Converts a file to ArrayBuffer
 * @param file The file to convert
 * @returns Promise resolving to ArrayBuffer
 */
const fileToArrayBuffer = async (file: File): Promise<ArrayBuffer> => {
	return await file.arrayBuffer();
};

/**
 * Processes a file by checking if it's an image and uploading to S3
 * @param file The file to process
 * @returns Promise resolving to the S3 link or null
 */
export const processImageFile = async (file: File): Promise<string | null> => {
	if (!file) return null;

	if (isImage(file)) {
		return await uploadToS3(file);
	}

	return null;
};
