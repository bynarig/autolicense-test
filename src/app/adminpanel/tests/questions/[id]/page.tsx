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
import { clientSignIn } from "@/app/(root)/user/(auth)/auth-actions";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import { redirect, useParams } from "next/navigation";

export default function Page() {
	const params = useParams();
	const [questionData, setquestionData] = useState<any>(null);

	async function onUpdatequestionData(data: {
		email: string;
		password: string;
	}) {
		const res = await clientSignIn(data);

		if (res.ok) {
			// await update(); // Force session update
			// The useEffect will handle the redirect automatically
		} else {
			const errorData = await res.json();
			// Handle error display to user
			// console.error("Login failed:", errorData.error)
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
		},
	});

	React.useEffect(() => {
		if (questionData) {
			form.reset({
				name: questionData.title || "",
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
			setquestionData(json.data);
			toast(`question id:${id} fetched.`);
		} else {
			setquestionData([]);
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
			<div className="flex flex-col justify-left w-full mt-[20px]">
				<h1 className="text-2xl font-bold">
					question ID: {questionData?.id}
				</h1>
				<Form {...form}>
					<form
						// onSubmit={form.handleSubmit(onUpdatequestionData)}
						className="space-y-8 "
					>
						<div className="flex flex-row space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel></FormLabel>
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
						<p>
							Author: {questionData?.author?.name} & id:{" "}
							{questionData?.author?.id}
						</p>
						<p>Created At: {questionData?.createdAt}</p>
						<p>Edited At: {questionData?.editedAt || "never"}</p>
						<p>Views: {questionData?.views || 0}</p>
						<p>Attempts: {questionData?.attempts || 0}</p>
						<p>TimeCompleted: {questionData?.timeCompleted || 0}</p>
						<p>MaxScore: {questionData?.maxScore || 0}</p>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant="outline">
									Update question Data
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Are you absolutely sure?
									</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will
										change this question data without any
										previous backups
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction type="submit">
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
										This action cannot be undone. This will
										delete this test data without any
										previous backups
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => onQuestionDelete()}
									>
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</form>
				</Form>
			</div>
		</>
	);
}
