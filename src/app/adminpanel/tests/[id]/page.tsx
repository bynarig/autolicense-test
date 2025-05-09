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
import { clientSignIn } from "@/app/(root)/user/(auth)/auth-actions";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import { redirect, useParams } from "next/navigation";

export default function Page() {
	const params = useParams();
	const [testData, setTestData] = useState<any>(null);

	async function onUpdateTestData(data: { email: string; password: string }) {
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

	async function onTestDelete() {
		const id = params.id;
		const res = await fetch(`/api/admin/tests/${id}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		});
		if (res.status === 200) {
			const json = await res.json();
			redirect("/adminpanel/tests");
			// setTestData(json.data);
			toast(`Test id:${id} deleted.`);
		} else {
			// setTestData([]);
			const json = await res.json();
			toast(
				`Failed to delete test. err code: ${res.status} errmsg: ${json.error}`,
			);
		}
	}

	const form = useForm<z.infer<typeof testValidationSchema>>({
		defaultValues: {
			name: "",
		},
	});

	React.useEffect(() => {
		if (testData) {
			form.reset({
				name: testData.title || "",
			});
		}
	}, [testData, form]);

	const getTestData = useCallback(async () => {
		const id = params.id;
		const res = await fetch(`/api/admin/tests/${id}`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});
		if (res.status === 200) {
			const json = await res.json();
			setTestData(json.data);
			toast(`Test id:${id} fetched.`);
		} else {
			setTestData([]);
			const json = await res.json();
			toast(
				`Failed to get test. err code: ${res.status} errmsg: ${json.error}`,
			);
		}
	}, [params.id]);

	React.useEffect(() => {
		getTestData();
	}, [getTestData]);

	return (
		<>
			<div className="flex flex-col justify-left w-full mt-[20px]">
				<h1 className="text-2xl font-bold">TEST ID: {testData?.id}</h1>
				<Form {...form}>
					<form
						// onSubmit={form.handleSubmit(onUpdateTestData)}
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
							Author: {testData?.author.name} & id:{" "}
							{testData?.author.id}
						</p>
						<p>Created At: {testData?.createdAt}</p>
						<p>Edited At: {testData?.updatedAt || "never"}</p>
						<p>Views: {testData?.views || 0}</p>
						<p>Attempts: {testData?.attempts || 0}</p>
						<p>TimeCompleted: {testData?.timeCompleted || 0}</p>
						<p>MaxScore: {testData?.maxScore || 0}</p>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant="outline">
									Update Test Data
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Are you absolutely sure?
									</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will
										change this test data without any
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
								<Button variant="outline">Delete TEST</Button>
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
										onClick={() => onTestDelete()}
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
