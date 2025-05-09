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
import { SearchForm } from "@/components/SearchForm";
import { fetchQuestions } from "@client/services/question.service";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

export default function Page() {
	const [questions, setQuestions] = useState<any[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const initialLoadDone = useRef(false);
	const itemsPerPage = 50;

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

	const handleSearch = useCallback(async (term: string) => {
		setSearchTerm(term);
		setCurrentPage(1); // Reset to first page on new search
		const result = await fetchQuestions(term, 1, itemsPerPage);
		setQuestions(result.questions);
		setTotalCount(result.totalCount);
	}, []);

	const handlePageChange = useCallback(
		async (page: number) => {
			setCurrentPage(page);
			const result = await fetchQuestions(searchTerm, page, itemsPerPage);
			setQuestions(result.questions);
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

	async function onQuestionCreate(data: {
		questionName: string;
		imageUrl?: string | null;
	}) {
		const res = await fetch("/api/admin/tests/questions", {
			method: "POST",
			body: JSON.stringify(data),
			headers: { "Content-Type": "application/json" },
		});
		if (res.status === 200) {
			const json = await res.json();
			// Update questions array by adding the new question
			setQuestions((prevQuestions) => [...prevQuestions, json.data]);
			// Or refetch all questions
			// onSubmit({ search: "" });
			toast("Question successfully created.");
			// Redirect to the question page
			window.location.href = `/adminpanel/tests/questions/${json.data.id}`;
		} else {
			const json = await res.json();
			toast(
				`Failed to create question. err code: ${res.status} errmsg: ${json.error} data sended ${data.questionName}`,
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
					placeholder="search question"
					schema={searchSchema}
				/>

				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button
							variant="outline"
							onClick={() => setDialogOpen(true)}
						>
							Create new question
							<PlusIcon />
						</Button>
					</DialogTrigger>

					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Create NEW question</DialogTitle>
							<DialogDescription>
								Create name for your question and upload an
								image. Click create when you&apos;re done.
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
								onClick={async () => {
									const inputValue = (
										document.getElementById(
											"newquestionname",
										) as HTMLInputElement
									)?.value;
									if (inputValue) {
										setIsUploading(true);
										try {
											const imageUrl = null;
											await onQuestionCreate({
												questionName: inputValue,
												imageUrl,
											});
											setDialogOpen(false);
										} catch (error) {
											console.error(
												"Error creating question:",
												error,
											);
											toast.error(
												"Failed to create question",
											);
										} finally {
											setIsUploading(false);
										}
									}
								}}
								type="submit"
								disabled={isUploading}
							>
								{isUploading ? "Creating..." : "Create"}
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

			{totalPages > 1 && (
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() =>
									currentPage > 1 &&
									handlePageChange(currentPage - 1)
								}
								className={
									currentPage === 1
										? "pointer-events-none opacity-50"
										: "cursor-pointer"
								}
							/>
						</PaginationItem>

						{getPageNumbers().map((page, index) => (
							<PaginationItem key={index}>
								{page === -1 ? (
									<span className="px-4">...</span>
								) : (
									<PaginationLink
										onClick={() => handlePageChange(page)}
										isActive={page === currentPage}
										className="cursor-pointer"
									>
										{page}
									</PaginationLink>
								)}
							</PaginationItem>
						))}

						<PaginationItem>
							<PaginationNext
								onClick={() =>
									currentPage < totalPages &&
									handlePageChange(currentPage + 1)
								}
								className={
									currentPage === totalPages
										? "pointer-events-none opacity-50"
										: "cursor-pointer"
								}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
}
