"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { EditIcon } from "lucide-react";
import imageUrl from "@/split/client/services/image.service";

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
	const [imageError, setImageError] = useState<boolean>(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const objectUrlRef = useRef<string | null>(null);

	// Reset state when initialImage changes
	useEffect(() => {
		// Clean up previous object URL if it exists
		if (objectUrlRef.current) {
			URL.revokeObjectURL(objectUrlRef.current);
			objectUrlRef.current = null;
		}

		// Reset selected file
		setSelectedFile(null);

		// Reset image preview to the new initialImage
		setImagePreview(getFullImageUrl(initialImage));
		setImageError(false);
	}, [initialImage]);

	// Clean up object URL when component unmounts
	useEffect(() => {
		return () => {
			if (objectUrlRef.current) {
				URL.revokeObjectURL(objectUrlRef.current);
				objectUrlRef.current = null;
			}
		};
	}, []);

	// Handle file selection
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && file.type.startsWith("image/")) {
			// Clean up previous object URL if it exists
			if (objectUrlRef.current) {
				URL.revokeObjectURL(objectUrlRef.current);
			}

			// Create a URL for the selected image for preview
			const previewUrl = URL.createObjectURL(file);
			objectUrlRef.current = previewUrl;
			setImagePreview(previewUrl);
			setSelectedFile(file);
			setImageError(false);

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
				{imageError ? (
					<div
						className={`flex items-center justify-center bg-gray-200 ${className}`}
						style={{ width, height }}
					>
						<span className="text-gray-500">
							No selected image or image is invalid.
						</span>
					</div>
				) : (
					<Image
						src={imagePreview}
						alt="Selected image preview"
						width={width}
						height={height}
						className={className}
						onError={() => setImageError(true)}
					/>
				)}

				{isHovering && (
					<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
						<span className="text-white font-medium">
							<EditIcon />
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
