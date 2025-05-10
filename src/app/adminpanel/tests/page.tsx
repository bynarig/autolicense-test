"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { searchSchema } from "@/validators/zod";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ArrowDownIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
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
import { SearchForm } from "@/components/SearchForm";
import Pagination from "@/components/Pagination";
import { getTests } from "@client/services/admin/testing.service";

export default function Page() {
	const [tests, setTests] = useState<any[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const initialLoadDone = useRef(false);
	const itemsPerPage = 50;

	const handleSearch = useCallback(async (term: string) => {
		setSearchTerm(term);
		setCurrentPage(1); // Reset to first page on new search
		const result = await getTests();
		setTests(result.tests);
		setTotalCount(result.totalCount);
	}, []);

	const handlePageChange = useCallback(
		async (page: number) => {
			setCurrentPage(page);
			const result = await getTests();
			setTests(result.tests);
			setTotalCount(result.totalCount);
		},
		[searchTerm],
	);

	// Initial data load
	React.useEffect(() => {
		if (!initialLoadDone.current) {
			handleSearch("");
			initialLoadDone.current = true;
		}
	});

	async function onTestCreate() {
		const res = await fetch("/api/admin/tests", {
			method: "GET",
			// body: JSON.stringify(data),
			headers: { "Content-Type": "application/json" },
		});
		if (res.status === 200) {
			const json = await res.json();
			// Update tests array by adding the new test
			setTests((prevTests) => [...prevTests, json.data]);
			// Or refetch all tests
			// onSubmit({ search: "" });
			toast("Test successfully created.");
			// Redirect to the test page
			window.location.href = `/adminpanel/tests/${json.data.id}`;
		} else {
			const json = await res.json();
			toast(
				`Failed to create test. err code: ${res.status} errmsg: ${json.error} data sended `,
			);
		}
	}

	// Calculate total pages
	const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

	// Generate page numbers for pagination
	const getPageNumbers = () => {
		const pages = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			// Show all pages if there are few
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Show a subset of pages with ellipsis
			if (currentPage <= 3) {
				// Near the start
				for (let i = 1; i <= 4; i++) {
					pages.push(i);
				}
				pages.push(-1); // Ellipsis
				pages.push(totalPages);
			} else if (currentPage >= totalPages - 2) {
				// Near the end
				pages.push(1);
				pages.push(-1); // Ellipsis
				for (let i = totalPages - 3; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				// Middle
				pages.push(1);
				pages.push(-1); // Ellipsis
				for (let i = currentPage - 1; i <= currentPage + 1; i++) {
					pages.push(i);
				}
				pages.push(-1); // Ellipsis
				pages.push(totalPages);
			}
		}

		return pages;
	};

	return (
		<div className="flex flex-col items-center w-full my-6 space-y-6">
			<div className="flex w-full space-x-2 place-content-center">
				<SearchForm
					onSearch={handleSearch}
					placeholder="search test"
					schema={searchSchema}
				/>

				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button
							variant="outline"
							onClick={() => setDialogOpen(true)}
						>
							Create new Test
							<PlusIcon />
						</Button>
					</DialogTrigger>

					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Create NEW test</DialogTitle>
							<DialogDescription>
								Create name for your test. Click save when
								you&apos;re done.
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
										// onTestCreate({ testName: inputValue });
										setDialogOpen(false);
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
										data-clipboard-text={
											test?.author?.name ||
											test?.author?.id ||
											"no data"
										}
									>
										{test?.author?.name ||
											`id: ${test?.author?.id}` ||
											"no data"}
									</Button>
								</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										className="copy-btn"
										data-clipboard-text={
											test.timeCompleted || "no data"
										}
									>
										{test.timeCompleted || "no data"}
									</Button>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			<Pagination
				currentPage={currentPage}
				onPageChange={handlePageChange}
				itemsPerPage={itemsPerPage}
				totalCount={totalCount as number}
			/>
		</div>
	);
}
