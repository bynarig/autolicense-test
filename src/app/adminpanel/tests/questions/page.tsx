"use client";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { searchSchema } from "@/shared/lib/zod";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ArrowDownIcon, PlusIcon, Search } from "lucide-react";
import Link from "next/link";
import ClipboardJS from "clipboard";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function Page() {
	const [questions, setquestions] = useState<any[]>([]);

	React.useEffect(() => {
		const clipboard = new ClipboardJS(".copy-btn", {
			text: function (trigger) {
				return trigger.getAttribute("data-clipboard-text") || "";
			},
		});

		clipboard.on("success", function (e) {
			toast.success(`Copied: ${e.text}`);
			e.clearSelection();
		});

		clipboard.on("error", function (e) {
			toast.error("Failed to copy text");
		});

		return () => {
			clipboard.destroy();
		};
	}, []);

	function validateInput(inputUnedited: string) {
		const input = inputUnedited.toLocaleLowerCase().trim();
		if (input.length == 24) {
			return "id";
		}
		if (searchSchema.safeParse(input).success) {
			return "name";
		}
	}

	const onSubmit = useCallback(async (data: { search: string }) => {
		const dataToSend = {
			data,
			inputType: validateInput(data.search),
		};
		let res;
		if (data.search.length == 0) {
			res = await fetch("/api/admin/tests/questions", {
				method: "GET",
				headers: { "Content-Type": "application/json" },
			});
		} else {
			res = await fetch("/api/admin/tests/questions", {
				method: "GET",
				body: JSON.stringify(dataToSend),
				headers: { "Content-Type": "application/json" },
			});
		}

		if (res.status === 200) {
			const json = await res.json();
			setquestions(json.data);
			toast("question successfully fetched.");
		} else {
			setquestions([]);
			const json = await res.json();
			toast(
				`Failed to get questions. err code: ${res.status} errmsg: ${json.error}`,
			);
		}
	}, []);

	React.useEffect(() => {
		onSubmit({ search: "" });
	}, [onSubmit]);

	async function onquestionCreate(data: { questionName: string }) {
		const res = await fetch("/api/admin/tests/questions", {
			method: "POST",
			body: JSON.stringify(data),
			headers: { "Content-Type": "application/json" },
		});
		if (res.status === 200) {
			const json = await res.json();
			// Update questions array by adding the new question
			setquestions((prevquestions) => [...prevquestions, json.data]);
			// Or refetch all questions
			// onSubmit({ search: "" });
			toast("question successfully created.");
		} else {
			const json = await res.json();
			toast(
				`Failed to create question. err code: ${res.status} errmsg: ${json.error} data sended ${data.questionName}`,
			);
		}
	}

	const form = useForm<z.infer<typeof searchSchema>>({
		defaultValues: {
			search: "",
		},
	});
	return (
		<div className="flex flex-col items-center w-full my-6 space-y-6">
			<div className="flex  w-full space-x-2 place-content-center">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8 "
					>
						<div className="flex flex-row space-y-4">
							<FormField
								control={form.control}
								name="search"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												type="text"
												placeholder="search question"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit">
								<Search />
								Search
							</Button>
						</div>
					</form>
				</Form>

				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline">
							Create new question
							<PlusIcon />
						</Button>
					</DialogTrigger>

					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Create NEW question</DialogTitle>
							<DialogDescription>
								Create name for your question. Click save when
								you&apos;re done.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="name" className="text-right">
									Name
								</Label>
								<Input
									id="newquestionname"
									defaultValue="New question"
									className="col-span-3"
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								onClick={() => {
									const inputValue = (
										document.getElementById(
											"newquestionname",
										) as HTMLInputElement
									)?.value;
									if (inputValue) {
										onquestionCreate({
											questionName: inputValue,
										});
									}
								}}
								type="submit"
							>
								Create
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
			{/* Table */}
			<Table>
				<TableCaption>A list of all questions.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>№</TableHead>
						<TableHead className="w-[100px]">
							<Button variant="ghost">
								id
								<ArrowDownIcon />
							</Button>
						</TableHead>
						<TableHead className="w-[100px]">Name</TableHead>
						<TableHead>Created At</TableHead>
						<TableHead>Author</TableHead>
						<TableHead>Times Completed</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{questions === undefined || questions.length === 0 ? (
						<TableRow>
							<TableCell colSpan={7} className="text-center">
								No questions found.
							</TableCell>
						</TableRow>
					) : (
						questions.map((question, idx) => (
							<TableRow key={question.id}>
								<TableCell>
									<Link
										href={`/adminpanel/tests/questions/${question.id}`}
									>
										<Button variant="ghost">
											{idx + 1}
										</Button>
									</Link>
								</TableCell>
								<TableCell className="font-medium">
									<Button
										variant="ghost"
										className="copy-btn"
										data-clipboard-text={question.id}
									>
										{question.id}
									</Button>
								</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										className="copy-btn"
										data-clipboard-text={question.title}
									>
										{question.title}
									</Button>
								</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										className="copy-btn"
										data-clipboard-text={
											question.createdAt
												? new Date(
														question.createdAt,
													).toLocaleDateString()
												: "—"
										}
									>
										{question.createdAt
											? new Date(
													question.createdAt,
												).toLocaleDateString()
											: "—"}
									</Button>
								</TableCell>

								<TableCell>
									<Button
										variant="ghost"
										className="copy-btn"
										data-clipboard-text={
											question?.author?.name ||
											question?.author?.id ||
											"no data"
										}
									>
										{question?.author?.name ||
											`id: ${question?.author?.id}` ||
											"no data"}
									</Button>
								</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										className="copy-btn"
										data-clipboard-text={
											question.timeCompleted || "no data"
										}
									>
										{question.timeCompleted || "no data"}
									</Button>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
