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
import { useParams, useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
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
import {
	deleteQuestion,
	getQuestion,
	updateQuestion,
} from "@client/services/admin/question.service";

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

	const router = useRouter();

	const handleImageSelect = (file: File) => {
		setSelectedImage(file);
	};

	async function onQuestionUpdate(data: Partial<QuestionType>) {
		const id = params.id;
		setIsUploading(true);

		// let imageUrl = data.imageUrl;
		//
		// if (selectedImage) {
		// 	imageUrl = await uploadImage(selectedImage);
		// }
		const res = await updateQuestion(data, id as string);
		if (res.success) {
			setQuestionData(res.data);
		} else {
			toast.error(`Failed to update question. Error: ${res.error}`);
		}

		setIsUploading(false);
	}

	async function onQuestionDelete() {
		const id = params.id;
		const res = await deleteQuestion(id as string);
		if (res.success) {
			router.push("/adminpanel/tests/questions");
		} else {
			toast(
				`Failed to delete question. err code: ${res.status} errmsg: ${res.error}`,
			);
		}
	}

	const onQuestionFetch = useCallback(async () => {
		const id = params.id;
		const res = await getQuestion(id as string);
		if (res.success) {
			setQuestionData(res.data);
		} else {
			toast(
				`Failed to get users. err code: ${res.status} errmsg: ${res.error}`,
			);
		}
	}, [params.id]);

	React.useEffect(() => {
		onQuestionFetch();
	}, []);

	const form = useForm<z.infer<typeof testValidationSchema>>({
		defaultValues: {
			title: "",
			text: "",
			points: 1,
		},
	});

	React.useEffect(() => {
		if (questionData) {
			form.reset({
				name: questionData.title || "",
				text: questionData.text || "",
				points: questionData.points || 1,
			});
		}
	}, [questionData, form]);

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
									onQuestionUpdate({
										title: data.title,
										text: data.text,
										points: data.points,

										category: [data.category],
										imageUrl: questionData?.imageUrl,
									}),
								)}
								className="space-y-8"
							>
								<div className="flex flex-col space-y-4">
									<FormField
										control={form.control}
										name="title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Question title
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
