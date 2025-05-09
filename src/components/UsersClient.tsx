"use client";

import React, { useCallback, useState } from "react";
import { searchSchema } from "@/validators/zod";
import { SearchForm } from "@/components/SearchForm";
import { UsersTable } from "@/components/UsersTable";
import { fetchUsers } from "@/app/adminpanel/users/userService";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

import { UserType } from "@/types";

interface UsersClientProps {
	initialUsers: UserType[];
	initialTotalCount: number;
}

/**
 * Client component for the users page with interactive features
 */
export function UsersClient({
	initialUsers,
	initialTotalCount,
}: UsersClientProps) {
	const [users, setUsers] = useState<UserType[]>(initialUsers);
	const [totalCount, setTotalCount] = useState<number>(initialTotalCount);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const itemsPerPage = 50;

	const handleSearch = useCallback(async (term: string) => {
		setIsLoading(true);
		setSearchTerm(term);
		setCurrentPage(1); // Reset to first page on new search

		try {
			const result = await fetchUsers(term, 1, itemsPerPage);
			setUsers(result.users);
			setTotalCount(result.totalCount);
		} catch (error) {
			console.error("Error searching users:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const handlePageChange = useCallback(
		async (page: number) => {
			setIsLoading(true);
			setCurrentPage(page);

			try {
				const result = await fetchUsers(searchTerm, page, itemsPerPage);
				setUsers(result.users);
				setTotalCount(result.totalCount);
			} catch (error) {
				console.error("Error changing page:", error);
			} finally {
				setIsLoading(false);
			}
		},
		[searchTerm],
	);

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
		<div className="flex flex-col w-full my-6 space-y-6">
			<SearchForm
				onSearch={handleSearch}
				placeholder="search user"
				schema={searchSchema}
			/>

			{isLoading ? (
				<div className="flex items-center justify-center h-40">
					<div className="h-8 w-8 rounded-full border-4 border-t-blue-500 border-b-blue-700 border-l-blue-600 border-r-blue-600 animate-spin"></div>
				</div>
			) : (
				<UsersTable users={users} />
			)}

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
									currentPage === 1 || isLoading
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
										className={
											isLoading
												? "pointer-events-none opacity-50"
												: "cursor-pointer"
										}
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
									currentPage === totalPages || isLoading
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
