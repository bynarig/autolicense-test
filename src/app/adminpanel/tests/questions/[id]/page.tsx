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
import { testValidationSchema } from "@/validators/zod";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import { redirect, useParams } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import { uploadImage } from "@/split/client/services/image.service";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionType } from "@/types/test-sysType";
import { toPrettyDate } from "@/lib/date";

const category = [
	{ value: "1", label: "1" },
	{ value: "2", label: "2" },
	{ value: "3", label: "3" },
];

export default function Page() {
	const params = useParams();
	const [questionData, setQuestionData] = useState<QuestionType>();
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState<boolean>(false);

	const handleImageSelect = (file: File) => {
		setSelectedImage(file);
	};

	async function onUpdateQuestionData(data: {
		imageUrl: any;
		name: string;
		points: number;
		text: string;
		category: string;
	}) {
		const id = params.id;
		setIsUploading(true);

		try {
			let imageUrl = data.imageUrl;

			if (selectedImage) {
				imageUrl = await uploadImage(selectedImage);
			}

			const res = await fetch(`/api/admin/tests/questions/${id}`, {
				method: "PUT",
				body: JSON.stringify({
					title: data.name,
					points: data.points,
					text: data.text,
					category: data.category,
					imageUrl: imageUrl,
				}),
				headers: { "Content-Type": "application/json" },
			});

			if (res.status === 200) {
				const json = await res.json();
				setQuestionData(json.data);
				toast.success("Question updated successfully");
			} else {
				const json = await res.json();
				toast.error(`Failed to update question. Error: ${json.error}`);
			}
		} catch (error) {
			console.error("Error updating question:", error);
			toast.error("Failed to update question");
		} finally {
			setIsUploading(false);
		}
	}

	async function onQuestionDelete() {
		const id = params.id;
		const res = await fetch(`/api/admin/tests/questions/${id}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		});
		if (res.status === 200) {
			const json = await res.json();
			redirect("/adminpanel/tests/questions");
			toast(`Question id:${id} deleted.`);
		} else {
			// setTestData([]);
			const json = await res.json();
			toast(
				`Failed to delete question. err code: ${res.status} errmsg: ${json.error}`,
			);
		}
	}

	const form = useForm<z.infer<typeof testValidationSchema>>({
		defaultValues: {
			name: "",
			text: "",
			points: 1,
			// category: [""],
		},
	});

	React.useEffect(() => {
		if (questionData) {
			form.reset({
				name: questionData.title || "",
				text: questionData.text || "",
				points: questionData.points || 1,
				// category: questionData.category || [""],
			});
		}
	}, [questionData, form]);

	const getquestionData = useCallback(async () => {
		const id = params.id;
		const res = await fetch(`/api/admin/tests/questions/${id}`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});
		if (res.status === 200) {
			const json = await res.json();
			setQuestionData(json.data);
			toast(`question id:${id} fetched.`);
		} else {
			const json = await res.json();
			toast(
				`Failed to get users. err code: ${res.status} errmsg: ${json.error}`,
			);
		}
	}, [params.id]);

	React.useEffect(() => {
		getquestionData();
	}, [getquestionData]);

	return (
		<>
			{!questionData ? (
				<div className="flex flex-col md:flex-row justify-between w-full">
					<div className="flex flex-col justify-left w-full mt-[20px]">
						<div className="space-y-8">
							<Skeleton className="h-16 w-[1000px]" />
							<Skeleton className="h-16 w-[1000px]" />
							<Skeleton className="h-16 w-[1000px]" />
							<Skeleton className="h-16 w-[1000px]" />
							<Skeleton className="h-16 w-[1000px]" />
							<Skeleton className="h-16 w-[1000px]" />
						</div>
					</div>
					<div className="flex flex-col place-content-right w-full mt-[20px]">
						<Skeleton className="h-100 w-100" />
					</div>
				</div>
			) : (
				<div className="flex flex-col md:flex-row justify-between w-full">
					<div className="flex flex-col justify-left w-full mt-[20px]">
						<Form {...form}>
							<form
								id="question-form"
								onSubmit={form.handleSubmit((data) =>
									onUpdateQuestionData({
										name: data.name,
										text: data.text,
										points: data.points,
										category: data.category,
										imageUrl: questionData?.imageUrl,
									}),
								)}
								className="space-y-8"
							>
								<div className="flex flex-col space-y-4">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Question Name
												</FormLabel>
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
									<FormField
										control={form.control}
										name="text"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Question Name
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Question Text"
														className="min-h-[100px]"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="category"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Category</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select a category" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{category.map(
															(category) => (
																<SelectItem
																	key={
																		category.value
																	}
																	value={
																		category.value
																	}
																>
																	{
																		category.label
																	}
																</SelectItem>
															),
														)}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="points"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Points for this question
												</FormLabel>
												<FormControl>
													<Input
														className="w-[80px]"
														type="number"
														placeholder="points"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<p>
									Author: {questionData?.author?.name} & id:{" "}
									{questionData?.author?.id}
								</p>
								<p>
									Created At:{" "}
									{toPrettyDate(questionData?.createdAt)}
								</p>
								<p>
									Edited At:{" "}
									{toPrettyDate(
										questionData?.updatedAt as Date,
									)}
								</p>
								<p>Views: {questionData?.views || 0}</p>
								<p>Attempts: {questionData?.attempts || 0}</p>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button
											variant="outline"
											disabled={isUploading}
										>
											{isUploading
												? "Updating..."
												: "Update Question Data"}
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Are you absolutely sure?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone.
												This will change this question
												data without any previous
												backups
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>
												Cancel
											</AlertDialogCancel>
											<AlertDialogAction
												type="submit"
												form="question-form"
											>
												Update
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant="outline">
											Delete question
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Are you absolutely sure?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone.
												This will delete this test data
												without any previous backups
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>
												Cancel
											</AlertDialogCancel>
											<AlertDialogAction
												onClick={() =>
													onQuestionDelete()
												}
											>
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</form>
						</Form>
					</div>
					<div className="flex flex-col place-content-right w-full mt-[20px]">
						<p></p>
						<ImageUploader
							initialImage={
								questionData?.imageUrl ||
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
