"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { EditIcon } from "lucide-react";
import imageUrl from "@/shared/lib/image-url";

interface ImageUploaderProps {
	initialImage?: string;
	onImageSelect: (file: File) => void;
	width?: number;
	height?: number;
	className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
	initialImage = "https://i.imgur.com/fXfpiBZ.jpeg",
	onImageSelect,
	width = 400,
	height = 400,
	className = "rounded-md object-cover",
}) => {
	// Convert path to full URL if it's a path (not a full URL or default image)
	const getFullImageUrl = (imagePath: string): string => {
		// Check if it's already a full URL (starts with http or https)
		if (imagePath.startsWith("http")) {
			return imagePath;
		}
		// Otherwise, assume it's a path and convert to full URL
		return imageUrl.getImageUrl(imagePath);
	};

	const [imagePreview, setImagePreview] = useState<string>(
		getFullImageUrl(initialImage),
	);
	const [isHovering, setIsHovering] = useState<boolean>(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Handle file selection
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && file.type.startsWith("image/")) {
			// Create a URL for the selected image for preview
			const previewUrl = URL.createObjectURL(file);
			setImagePreview(previewUrl);
			setSelectedFile(file);

			// Pass the file to the parent component
			onImageSelect(file);
		}
	};

	// Trigger file input click when image is clicked
	const handleImageClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<div className="grid w-full max-w-sm items-center gap-1.5">
			<div
				className="relative mb-4 cursor-pointer"
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
				onClick={handleImageClick}
			>
				<Image
					src={imagePreview}
					alt="Selected image preview"
					width={width}
					height={height}
					className={className}
				/>

				{isHovering && (
					<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
						<span className="text-white font-medium">
							{selectedFile ? "Image selected" : <EditIcon />}
						</span>
					</div>
				)}

				{/* Hidden file input */}
				<Input
					ref={fileInputRef}
					id="picture"
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					className="hidden"
				/>
			</div>
		</div>
	);
};

export default ImageUploader;
