"use client";

import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHeader,
	TableHead,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {ArrowDownIcon, Search} from "lucide-react";
import { searchSchema } from "@/shared/lib/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import ClipboardJS from "clipboard";
import Link from "next/link";

export default function Page() {
	const [users, setUsers] = useState<any[]>([]);

	React.useEffect(() => {
		// Initialize clipboard.js
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
			clipboard.destroy(); // Cleanup on component unmount
		};
	}, []);

	function validateInput(inputUnedited: string) {
		const input = inputUnedited.toLocaleLowerCase().trim();
		if (input.length == 24) {
			return "id";
		}
		if (searchSchema.safeParse(input).success) {
			return "email";
		}
		if (input == "admin" || input == "unapproved" || input == "user") {
			return "role";
		} else {
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
			res = await fetch("/api/admin/users", {
				method: "POST",
				body: JSON.stringify(dataToSend),
				headers: { "Content-Type": "application/json" },
			});
		} else {
			res = await fetch("/api/admin/users/search", {
				method: "POST",
				body: JSON.stringify(dataToSend),
				headers: { "Content-Type": "application/json" },
			});
		}

		if (res.status === 200) {
			const json = await res.json();
			setUsers(json.data);
			toast("Successfully users fetched.");
		} else {
			setUsers([]);
			const json = await res.json();
			toast(
				`Failed to get users. err code: ${res.status} errmsg: ${json.error}`,
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
			<div className="flex max-w-sm w-full space-x-2">
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
												placeholder="search user"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit"><Search/>Search</Button>
						</div>
					</form>
				</Form>
			</div>
			{/* Table */}
			<Table>
				<TableCaption>A list of all users.</TableCaption>
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
						<TableHead>Email</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Registered at</TableHead>
						<TableHead>Latest active</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users === undefined || users.length === 0 ? (
						<TableRow>
							<TableCell colSpan={7} className="text-center">
								No users found.
							</TableCell>
						</TableRow>
					) : (
						users.map((user, idx) => (
							<TableRow key={user.id}>
								<TableCell>
									<Link href={`/adminpanel/users/${user.id}`}>
										<Button variant="ghost">
											{idx + 1}
										</Button>
									</Link>
								</TableCell>
								<TableCell className="font-medium">
									<Button
										variant="ghost"
										className="copy-btn"
										data-clipboard-text={user.id}
									>
										{user.id}
									</Button>
								</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										className="copy-btn"
										data-clipboard-text={user.name}
									>
										{user.name}
									</Button>
								</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										className="copy-btn"
										data-clipboard-text={user.email}
									>
										{user.email}
									</Button>
								</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										className="copy-btn"
										data-clipboard-text={user.role}
									>
										{user.role}
									</Button>
								</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										className="copy-btn"
										data-clipboard-text={
											user.createdAt
												? new Date(
														user.createdAt,
													).toLocaleDateString()
												: "—"
										}
									>
										{user.createdAt
											? new Date(
													user.createdAt,
												).toLocaleDateString()
											: "—"}
									</Button>
								</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										className="copy-btn"
										data-clipboard-text={
											user.lastActive
												? new Date(
														user.lastActive,
													).toLocaleDateString()
												: "—"
										}
									>
										{user.lastActive
											? new Date(
													user.lastActive,
												).toLocaleDateString()
											: "—"}
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
