"use client";

import React, { Suspense, useCallback, useState } from "react";
import { toast } from "sonner";
import { redirect, useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { z } from "zod";
import UserInfoDisplay from "@/components/UserInfoDisplay";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { userValidationSchema } from "@/validators/zod";

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
	subscriptionLVL: z.number().optional(),
	subscriptionType: z.string().optional(),
	emailVerified: z.boolean().optional(),
});

type UserFormData = z.infer<typeof userValidationSchema>;

const roles = [
	{ value: "UNAPPROVED", label: "UNAPPROVED" },
	{ value: "USER", label: "USER" },
	{ value: "ADMIN", label: "ADMIN" },
];

export default function Page() {
	const params = useParams();
	const [userData, setUserData] = useState<any>();
	const [originalData, setOriginalData] = useState<UserFormData | null>(null);

	const form = useForm<UserFormData>({
		defaultValues: {
			name: "",
			username: "",
			email: "",
			role: "",
			password: "",
			subscriptionExpiresAt: undefined,
			avatarUrl: "",
			subscriptionLVL: 0,
			subscriptionType: "",
			emailVerified: false,
		},
	});

	// Reset form when userData changes
	React.useEffect(() => {
		if (userData) {
			form.reset({
				name: userData.name || "",
				username: userData.username || "",
				email: userData.email || "",
				role: userData.role || "",
				password: "",
				subscriptionExpiresAt: userData.subscriptionExpiresAt
					? new Date(userData.subscriptionExpiresAt)
					: undefined,
				avatarUrl: userData.avatarUrl || "",
				subscriptionLVL: userData.subscriptionLVL || 0,
				subscriptionType: userData.subscriptionType || "",
				emailVerified: userData.emailVerified || false,
			});
		}
	}, [userData, form]);

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

			// Only proceed if there are changes to submit
			if (Object.keys(changedFields).length === 0) {
				toast.info("No changes detected");
				return;
			}

			const res = await fetch(`/api/admin/users/${params.id}`, {
				method: "PATCH",
				body: JSON.stringify({ changedFields }),
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
					subscriptionExpiresAt:
						updatedData.data.subscriptionExpiresAt,
					avatarUrl: updatedData.data.avatarUrl,
					subscriptionLVL: updatedData.data.subscriptionLVL,
					subscriptionType: updatedData.data.subscriptionType,
					emailVerified: updatedData.data.emailVerified,
				});
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
				subscriptionExpiresAt: json.data.subscriptionExpiresAt as Date,
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

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(handleFormSubmit)}
								className="space-y-2"
							>
								<div className="flex">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input
														type="text"
														placeholder="Name"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="flex">
									<FormField
										control={form.control}
										name="username"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Username</FormLabel>
												<FormControl>
													<Input
														type="text"
														placeholder="Username"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="flex">
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														type="text"
														placeholder="Email"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="flex">
									<FormField
										control={form.control}
										name="role"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Role</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select a role" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{roles.map((role) => (
															<SelectItem
																key={role.value}
																value={
																	role.value
																}
															>
																{role.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="flex">
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input
														type="password"
														placeholder="Set new password"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name="subscriptionExpiresAt"
									render={({ field }) => (
										<FormItem className="flex flex-col">
											<FormLabel>
												Subscription Expires At
											</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant={"outline"}
															className={cn(
																"w-[240px] pl-3 text-left font-normal",
																!field.value &&
																	"text-muted-foreground",
															)}
														>
															{field.value ? (
																format(
																	field.value,
																	"PPP",
																)
															) : (
																<span>
																	Select date
																</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent
													className="w-auto p-0"
													align="start"
												>
													<Calendar
														mode="single"
														selected={field.value}
														onSelect={
															field.onChange
														}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Subscription Level */}
								<div className="flex">
									<FormField
										control={form.control}
										name="subscriptionLVL"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Subscription Level
												</FormLabel>
												<FormControl>
													<Input
														type="text"
														placeholder="Subscription Level"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Subscription Type */}
								<div className="flex">
									<FormField
										control={form.control}
										name="subscriptionType"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Subscription Type
												</FormLabel>
												<FormControl>
													<Input
														type="text"
														placeholder="Subscription Type"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Email Verified */}
								<div className="flex">
									<FormField
										control={form.control}
										name="emailVerified"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Email Verified
												</FormLabel>
												<Select
													onValueChange={(value) =>
														field.onChange(
															value === "true",
														)
													}
													defaultValue={
														field.value
															? "true"
															: "false"
													}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Email Verified Status" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="true">
															Yes
														</SelectItem>
														<SelectItem value="false">
															No
														</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<Button type="submit">Save User Data</Button>
							</form>
						</Form>

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

					<div className="flex flex-col place-content-right w-full mt-[20px]"></div>
				</div>
			)}
		</>
	);
}
