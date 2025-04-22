import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { processImageFile } from "@/shared/lib/aws";
import { toast } from "sonner";
import { EditIcon } from "lucide-react";

interface ImageUploaderProps {
	initialImage?: string;
	onImageSelect?: (file: File) => void;
}

export function ImageUploader({
	initialImage = "https://i.imgur.com/fXfpiBZ.jpeg",
	onImageSelect,
}: ImageUploaderProps) {
	// State to store the selected image preview URL
	const [imagePreview, setImagePreview] = useState(initialImage);
	const [isHovering, setIsHovering] = useState(false);
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
			if (onImageSelect) {
				onImageSelect(file);
			}
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
			{/* Display image preview with hover effect */}
			<div
				className="relative mb-4 cursor-pointer"
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
				onClick={handleImageClick}
			>
				<Image
					src={imagePreview}
					alt="Selected image preview"
					width={400}
					height={400}
					className="rounded-md object-cover"
				/>

				{/* Overlay with text on hover */}
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
}
