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
import { QuestionType } from "@/types";
import {
	createQuestion,
	getQuestions,
} from "@client/services/admin/question.service";
import { useRouter } from "next/navigation";

export default function Page() {
	const [questions, setQuestions] = useState<QuestionType[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [isUploading, setIsUploading] = useState<boolean>(false);

	const itemsPerPage = 50;

	const router = useRouter();

	const handleSearch = useCallback(async (term: string) => {
		setSearchTerm(term);
		setCurrentPage(1);
		const result = await getQuestions();
		setQuestions(result.questions);
		setTotalCount(result.totalCount);
	}, []);

	const handlePageChange = useCallback(
		async (page: number) => {
			setCurrentPage(page);
			const result = await getQuestions();
			setQuestions(result.questions);
			setTotalCount(result.totalCount);
		},
		[searchTerm],
	);

	async function onQuestionCreate(data: {
		questionName: string;
		imageUrl?: string | null;
	}) {
		const res = await createQuestion(data);
		if (res.status === 200) {
			router.push(`/adminpanel/questions/${res.data.data.id}`);
		} else {
			toast(
				`Failed to create question. err code: ${res.status} errmsg: ${res.data.error} data sended ${data.questionName}`,
			);
		}
	}

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
						questions?.map((question, idx) => (
							<TableRow key={question.id}>
								<TableCell>
									<Link
										href={`/adminpanel/questions/${question.id}`}
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
											question.attempts || "no data"
										}
									>
										{question.attempts || "no data"}
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
