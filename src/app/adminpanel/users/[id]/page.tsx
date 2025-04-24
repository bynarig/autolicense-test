"use client";

import React, { Suspense, useCallback, useState } from "react";
import { toast } from "sonner";
import { redirect, useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { z } from "zod";
import ImageUploader from "@/components/ImageUploader";
import UserForm, { UserFormData } from "@/components/UserForm";
import UserInfoDisplay from "@/components/UserInfoDisplay";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";

// Define the validation schema for user data
const userUpdateSchema = z.object({
	name: z.string().min(1, "Name is required").optional(),
	username: z.string().min(1, "Username is required").optional(),
	email: z.string().email("Invalid email address").optional(),
	role: z.string().min(1, "Role is required").optional(),
	password: z.string().optional(),
	adminPassword: z.string().optional(),
	subscriptionExpiresAt: z.date().optional(),
	avatarUrl: z.string().optional(),
	subscriptionLVL: z.string().optional(),
	subscriptionType: z.string().optional(),
	emailVerified: z.boolean().optional(),
});

export default function Page() {
	const params = useParams();
	const [userData, setUserData] = useState<any>(null);
	const [selectedImageFile, setSelectedImageFile] = useState<File | null>(
		null,
	);
	const [originalData, setOriginalData] = useState<UserFormData | null>(null);

	// Handle image selection from ImageUploader component
	const handleImageSelect = (file: File) => {
		setSelectedImageFile(file);
	};

	// Handle form submission
	async function handleFormSubmit(data: UserFormData) {
		try {
			// Validate the data with Zod
			userUpdateSchema.parse(data);

			// Create an object to store only the changed fields
			const changedFields: Partial<UserFormData> = {};

			// Compare with original data and only include changed fields
			if (originalData) {
				if (data.name !== originalData.name)
					changedFields.name = data.name;
				if (data.username !== originalData.username)
					changedFields.username = data.username;
				if (data.email !== originalData.email)
					changedFields.email = data.email;
				if (data.role !== originalData.role)
					changedFields.role = data.role;

				// Handle password change with admin password verification
				if (data.password) {
					if (!data.adminPassword) {
						toast.error(
							"Admin password is required to change user's password",
						);
						return;
					}
					changedFields.password = data.password;
					changedFields.adminPassword = data.adminPassword;
				}

				// Compare dates properly
				const originalDate = originalData.subscriptionExpiresAt
					? new Date(originalData.subscriptionExpiresAt).toISOString()
					: null;
				const newDate = data.subscriptionExpiresAt
					? new Date(data.subscriptionExpiresAt).toISOString()
					: null;
				if (originalDate !== newDate)
					changedFields.subscriptionExpiresAt =
						data.subscriptionExpiresAt;

				// Compare new fields
				if (data.subscriptionLVL !== originalData.subscriptionLVL)
					changedFields.subscriptionLVL = data.subscriptionLVL;
				if (data.subscriptionType !== originalData.subscriptionType)
					changedFields.subscriptionType = data.subscriptionType;
				if (data.emailVerified !== originalData.emailVerified)
					changedFields.emailVerified = data.emailVerified;
			}

			// If there's a selected image file, upload it first
			if (selectedImageFile) {
				try {
					toast.info("Uploading image...");

					const formData = new FormData();
					formData.append("file", selectedImageFile);

					const uploadResponse = await fetch("/api/storage/upload", {
						method: "POST",
						body: formData,
					});

					if (uploadResponse.ok) {
						const { path, url } = await uploadResponse.json();
						// Store only the path in the database, not the full URL
						changedFields.avatarUrl = path;
						toast.success("Image uploaded successfully");
					} else {
						toast.error(
							`Failed to upload image, err: ${uploadResponse.status}`,
						);
					}
				} catch (error) {
					console.error("Error uploading image:", error);
					toast.error("Error uploading image");
				}
			}

			// Only proceed if there are changes to submit
			if (Object.keys(changedFields).length === 0) {
				toast.info("No changes detected");
				return;
			}

			const res = await fetch(`/api/admin/users/${params.id}`, {
				method: "POST",
				body: JSON.stringify(changedFields),
				headers: { "Content-Type": "application/json" },
			});

			if (res.status === 200) {
				const updatedData = await res.json();
				setUserData(updatedData.data);
				setOriginalData({
					name: updatedData.data.name,
					username: updatedData.data.username,
					email: updatedData.data.email,
					role: updatedData.data.role,
					subscriptionExpiresAt: updatedData.data
						.subscriptionExpiresAt
						? new Date(updatedData.data.subscriptionExpiresAt)
						: undefined,
					avatarUrl: updatedData.data.avatarUrl,
					subscriptionLVL: updatedData.data.subscriptionLVL,
					subscriptionType: updatedData.data.subscriptionType,
					emailVerified: updatedData.data.emailVerified,
				});
				toast.success(`User id:${params.id} edited.`);
			} else {
				const json = await res.json();
				toast.error(
					`Failed to edit user. err code: ${res.status} errmsg: ${json.error}`,
				);
			}
		} catch (error) {
			if (error instanceof z.ZodError) {
				// Handle validation errors
				const errorMessages = error.errors
					.map((err) => `${err.path.join(".")}: ${err.message}`)
					.join(", ");
				toast.error(`Validation error: ${errorMessages}`);
			} else {
				console.error("Error submitting form:", error);
				toast.error("An unexpected error occurred");
			}
		}
	}

	// Handle user deletion
	async function handleUserDelete() {
		const id = params.id;
		const res = await fetch(`/api/admin/users/${id}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		});
		if (res.status === 200) {
			await res.json();
			toast.success(`User id:${id} deleted.`);
			redirect("/adminpanel/users");
		} else {
			const json = await res.json();
			toast.error(
				`Failed to delete user. err code: ${res.status} errmsg: ${json.error}`,
			);
		}
	}

	// Fetch user data
	const getUserData = useCallback(async () => {
		const id = params.id;
		const res = await fetch(`/api/admin/users/${id}`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});
		if (res.status === 200) {
			const json = await res.json();
			setUserData(json.data);

			// Store the original data for comparison when detecting changes
			setOriginalData({
				name: json.data.name,
				username: json.data.username,
				email: json.data.email,
				role: json.data.role,
				subscriptionExpiresAt: json.data.subscriptionExpiresAt
					? new Date(json.data.subscriptionExpiresAt)
					: undefined,
				avatarUrl: json.data.avatarUrl,
				subscriptionLVL: json.data.subscriptionLVL,
				subscriptionType: json.data.subscriptionType,
				emailVerified: json.data.emailVerified,
			});

			toast.success(`User id:${id} fetched.`);
		} else {
			const json = await res.json();
			toast.error(
				`Failed to get user. err code: ${res.status} errmsg: ${json.error}`,
			);
		}
	}, [params.id]);

	React.useEffect(() => {
		getUserData().then();
	}, [getUserData]);

	return (
		<>
			{!userData ? (
				<Suspense
					fallback={
						<div>
							<Skeleton />
						</div>
					}
				></Suspense>
			) : (
				<div className="flex flex-col md:flex-row justify-between w-full">
					<div className="flex flex-col justify-left w-full mt-[20px]">
						<h1 className="text-2xl font-bold">
							User ID: {userData?.id}
						</h1>

						{/* User Form Component */}
						<UserForm
							initialData={{
								name: userData.name,
								username: userData.username,
								email: userData.email,
								role: userData.role,
								subscriptionExpiresAt:
									userData.subscriptionExpiresAt
										? new Date(
												userData.subscriptionExpiresAt,
											)
										: undefined,
								avatarUrl: userData.avatarUrl,
								subscriptionLVL: userData.subscriptionLVL,
								subscriptionType: userData.subscriptionType,
								emailVerified: userData.emailVerified,
							}}
							onSubmit={handleFormSubmit}
						/>

						{/* Read-only User Information */}
						<div className="mt-4">
							<UserInfoDisplay userData={userData} />
						</div>

						{/* Delete User Dialog */}
						<div className="mt-4">
							<DeleteConfirmationDialog
								title="Are you absolutely sure?"
								description="This action cannot be undone. This will delete this user data without any previous backups."
								triggerText="Delete User"
								onConfirm={handleUserDelete}
								variant="outline"
							/>
						</div>
					</div>

					<div className="flex flex-col place-content-right w-full mt-[20px]">
						{/* Image Uploader Component */}
						<ImageUploader
							initialImage={
								userData.avatarUrl ||
								"https://i.imgur.com/fXfpiBZ.jpeg"
							}
							onImageSelect={handleImageSelect}
							width={400}
							height={400}
						/>
					</div>
				</div>
			)}
		</>
	);
}
