"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import Image from "next/image";

import { cn } from "@/shared/lib/utils";

function Avatar({
	className,
	...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
	return (
		<AvatarPrimitive.Root
			data-slot="avatar"
			className={cn(
				"relative flex size-8 shrink-0 overflow-hidden rounded-full",
				className,
			)}
			{...props}
		/>
	);
}

function AvatarImage({
	className,
	src,
	alt = "",
	width = 40,
	height = 40,
	...props
}: React.ComponentProps<typeof AvatarPrimitive.Image> & {
	width?: number;
	height?: number;
}) {
	// If src is a remote URL (not a data URL or relative path), use Next.js Image
	const isRemoteUrl =
		typeof src === "string" &&
		(src.startsWith("http://") || src.startsWith("https://"));

	return (
		<AvatarPrimitive.Image
			data-slot="avatar-image"
			className={cn("aspect-square size-full", className)}
			{...props}
			asChild={isRemoteUrl}
		>
			{isRemoteUrl ? (
				<Image
					src={src as string}
					alt={alt}
					width={width}
					height={height}
					priority={true}
					className={cn(
						"aspect-square size-full object-cover",
						className,
					)}
				/>
			) : null}
		</AvatarPrimitive.Image>
	);
}

function AvatarFallback({
	className,
	...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
	return (
		<AvatarPrimitive.Fallback
			data-slot="avatar-fallback"
			className={cn(
				"bg-muted flex size-full items-center justify-center rounded-full",
				className,
			)}
			{...props}
		/>
	);
}

export { Avatar, AvatarImage, AvatarFallback };
