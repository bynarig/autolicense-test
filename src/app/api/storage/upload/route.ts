import { NextRequest, NextResponse } from "next/server";
import {
	getImageUrl,
	uploadImage,
} from "@/split/server/services/image.service";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json(
				{ error: "No file provided" },
				{ status: 400 },
			);
		}

		// Get width from query parameters if provided
		const url = new URL(request.url);
		const widthParam = url.searchParams.get("width");
		const width = widthParam ? parseInt(widthParam, 10) : undefined;

		// Upload and process the image using the image service
		const filePath = await uploadImage(file, { width });

		// Return both the path and full URL
		const imageUrlValue = await getImageUrl(filePath);
		return NextResponse.json({
			path: filePath,
			url: imageUrlValue,
		});
	} catch (error) {
		console.error("Error uploading file:", error);
		return NextResponse.json(
			{ error: "Failed to upload file" },
			{ status: 500 },
		);
	}
}
