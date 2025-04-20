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
import React, { useState } from "react";
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
	const [tests, setTests] = useState<any[]>([]);

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

	React.useEffect(() => {
		onSubmit({ search: "" });
	}, []);

	async function onSubmit(data: { search: string }) {
		const dataToSend = {
			data,
			inputType: validateInput(data.search),
		};
		let res;
		if (data.search.length == 0) {
			res = await fetch("/api/admin/tests", {
				method: "GET",
				// body: JSON.stringify(dataToSend),
				headers: { "Content-Type": "application/json" },
			});
		} else {
			res = await fetch("/api/admin/tests", {
				method: "GET",
				body: JSON.stringify(dataToSend),
				headers: { "Content-Type": "application/json" },
			});
		}

		if (res.status === 200) {
			const json = await res.json();
			setTests(json.data);
			toast("Test successfully fetched.");
		} else {
			setTests([]);
			const json = await res.json();
			toast(
				`Failed to get tests. err code: ${res.status} errmsg: ${json.error}`,
			);
		}
	}

	async function onTestCreate(data: { testName: string }) {
		const res = await fetch("/api/admin/tests", {
			method: "POST",
			body: JSON.stringify(data),
			headers: { "Content-Type": "application/json" },
		});
		if (res.status === 200) {
			const json = await res.json();
			setTests(json.data);
			toast("Test successfully created.");
		} else {
			setTests([]);
			const json = await res.json();
			toast(
				`Failed to create test. err code: ${res.status} errmsg: ${json.error} data sended ${data.testName}`,
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
												placeholder="search test"
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
							Create new Test
							<PlusIcon />
						</Button>
					</DialogTrigger>

					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Create NEW test</DialogTitle>
							<DialogDescription>
								Create name for your test. Click save when
								you're done.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="name" className="text-right">
									Name
								</Label>
								<Input
									id="newtestname"
									defaultValue="New Test"
									className="col-span-3"
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								onClick={() => {
									const inputValue = (
										document.getElementById(
											"newtestname",
										) as HTMLInputElement
									)?.value;
									if (inputValue) {
										onTestCreate({ testName: inputValue });
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
				<TableCaption>A list of all tests.</TableCaption>
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
					{tests === undefined || tests.length === 0 ? (
						<TableRow>
							<TableCell colSpan={7} className="text-center">
								No tests found.
							</TableCell>
						</TableRow>
					) : (
						tests.map((test, idx) => (
							<TableRow key={test.id}>
								<TableCell>
									<Link href={`/adminpanel/tests/${test.id}`}>
										<Button variant="ghost">
											{idx + 1}
										</Button>
									</Link>
								</TableCell>
								<TableCell className="font-medium">
									<Button
										variant="ghost"
										className="copy-btn"
										data-clipboard-text={test.id}
									>
										{test.id}
									</Button>
								</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										className="copy-btn"
										data-clipboard-text={test.title}
									>
										{test.title}
									</Button>
								</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										className="copy-btn"
										data-clipboard-text={
											test.createdAt
												? new Date(
														test.createdAt,
													).toLocaleDateString()
												: "—"
										}
									>
										{test.createdAt
											? new Date(
													test.createdAt,
												).toLocaleDateString()
											: "—"}
									</Button>
								</TableCell>

								<TableCell>
									<Button
										variant="ghost"
										className="copy-btn"
										data-clipboard-text={test.author.name}
									>
										{test.author.name}
									</Button>
								</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										className="copy-btn"
										data-clipboard-text={test.timeCompleted || "no data"}
									>
										{test.timeCompleted || "no data"}
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
