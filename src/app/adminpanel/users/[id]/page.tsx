"use client";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { testValidationSchema } from "@/shared/lib/zod";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import { redirect, useParams } from "next/navigation";
import Image from "next/image";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ImageUploader } from "@/app/adminpanel/users/[id]/ImagePicker";
import { processImageFile } from "@/shared/lib/aws";

export default function Page() {
	const params = useParams();
	const [userData, setuserData] = useState<any>(null);

	const [selectedImageFile, setSelectedImageFile] = useState<File | null>(
		null,
	);
	const [avatarUrl, setAvatarUrl] = useState<string | null>(
		userData?.avatarUrl || null,
	);

	// Handle image selection
	const handleImageSelect = (file: File) => {
		setSelectedImageFile(file);
	};

	// Modify your form submission function
	async function onUpdateUserData(data: {
		email: string;
		password: string;
		subscriptionExpiresAt: any;
		role: string;
		name: string;
		username: string;
	}) {
		// If there's a selected image file, upload it first
		if (selectedImageFile) {
			try {
				toast.info("Uploading image...");
				const imgurUrl = await processImageFile(selectedImageFile);
				if (imgurUrl) {
					setAvatarUrl(imgurUrl);
					data = { ...data };
					toast.success("Image uploaded successfully");
				} else {
					toast.error("Failed to upload image");
				}
			} catch (error) {
				console.error("Error uploading image:", error);
				toast.error("Error uploading image");
			}
		}

		// Continue with the user data update
		const id = params.id;
		const res = await fetch(`/api/admin/users/${id}`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: { "Content-Type": "application/json" },
		});

		if (res.status === 200) {
			const json = await res.json();
			toast(`User id:${id} edited.`);
		} else {
			const json = await res.json();
			toast(
				`Failed to edit user. err code: ${res.status} errmsg: ${json.error}`,
			);
		}
	}

	async function onuserDelete() {
		const id = params.id;
		const res = await fetch(`/api/admin/users/${id}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		});
		if (res.status === 200) {
			const json = await res.json();
			redirect("/adminpanel/users");
			// setuserData(json.data);
			toast(`user id:${id} deleted.`);
		} else {
			// setuserData([]);
			const json = await res.json();
			toast(
				`Failed to delete user. err code: ${res.status} errmsg: ${json.error}`,
			);
		}
	}

	const form = useForm<z.infer<typeof testValidationSchema>>({
		defaultValues: {
			name: "",
			username: "",
			email: "",
			role: "",
			password: "",
			avatarUrl: "",
			subscriptionExpiresAt: new Date("1900-01-01"),
		},
	});

	React.useEffect(() => {
		if (userData) {
			form.reset({
				name: userData.name || "",
				username: userData.username || "",
				email: userData.email || "",
				role: userData.role || "",
				password: "",
				subscriptionExpiresAt:
					userData?.subscriptionExpiresAt || new Date("1900-01-01"),
			});
		}
	}, [userData, form]);

	const getuserData = useCallback(async () => {
		const id = params.id;
		const res = await fetch(`/api/admin/users/${id}`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});
		if (res.status === 200) {
			const json = await res.json();
			setuserData(json.data);
			toast(`user id:${id} fetched.`);
		} else {
			setuserData([]);
			const json = await res.json();
			toast(
				`Failed to get user. err code: ${res.status} errmsg: ${json.error}`,
			);
		}
	}, [params.id]);

	React.useEffect(() => {
		getuserData();
	}, [getuserData]);

	return (
		<>
			<div className="flex flex-col md:flex-row justify-between w-full">
				<div className="flex flex-col justify-left w-full mt-[20px]">
					<h1 className="text-2xl font-bold">
						user ID: {userData?.id}
					</h1>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onUpdateUserData)}
							className="space-y-2 "
						>
							<div className="flex ">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>name</FormLabel>
											<FormControl>
												<Input
													type="text"
													placeholder="name"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="flex ">
								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormLabel>username</FormLabel>
											<FormControl>
												<Input
													type="text"
													placeholder="username"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="flex ">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>email</FormLabel>
											<FormControl>
												<Input
													type="text"
													placeholder="email"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="flex ">
								<FormField
									control={form.control}
									name="role"
									render={({ field }) => (
										<FormItem>
											<FormLabel>role</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue
															placeholder={
																userData?.role
															}
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="UNAPPROVED">
														UNAPPROVED
													</SelectItem>
													<SelectItem value="USER">
														USER
													</SelectItem>
													<SelectItem value="ADMIN">
														ADMIN
													</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="flex ">
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>password</FormLabel>
											<FormControl>
												<Input
													type="text"
													placeholder="set new password"
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
											subscriptionExpiresAt
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
																{userData?.subscriptionExpiresAt ||
																	"no subscruption"}
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
													onSelect={field.onChange}
													// disabled={(date) =>
													// 	date > new Date() ||
													// 	date <
													// 		new Date(
													// 			"1900-01-01",
													// 		)
													// }
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit">Update user data</Button>

							<p className="text-2xl md:mb-[10px]">
								subscriptionLVL: {userData?.subscriptionLVL}
							</p>
							<p className="text-2xl md:mb-[10px]">
								subscriptionType:{" "}
								{userData?.subscriptionType ||
									"no subscription"}
							</p>
							<p className="text-2xl md:mb-[10px]">
								subscriptionExpiresAt:{" "}
								{userData?.subscriptionExpiresAt ||
									"no subscription"}
							</p>
							<p className="text-2xl md:mb-[10px]">
								Email verified:{" "}
								{userData?.emailVerified ? "true" : "false"}
							</p>

							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="outline">
										Delete user
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you absolutely sure?
										</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This
											will delete this user data without
											any previous backups
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>
											Cancel
										</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => onuserDelete()}
										>
											Delete
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</form>
					</Form>
					<div></div>
				</div>
				<div className="flex flex-col place-content-right w-full mt-[20px]">
					<ImageUploader
						initialImage={
							userData?.avatarUrl ||
							"https://i.imgur.com/fXfpiBZ.jpeg"
						}
						onImageSelect={handleImageSelect}
					/>
					<p className="text-2xl md:mb-[10px]">
						Created At: {userData?.createdAt}
					</p>
					<p className="text-2xl md:mb-[10px]">
						lastLogin: {userData?.lastLogin || userData?.createdAt}
					</p>
					<p className="text-2xl md:mb-[10px]">
						Edited At: {userData?.editedAt || "never"}
					</p>
				</div>
			</div>
		</>
	);
}
