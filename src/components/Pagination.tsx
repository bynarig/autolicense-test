// Calculate total pages
import {
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

interface PaginationProps {
	currentPage: number;
	totalCount: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
	isLoading?: boolean;
}

export default function Pagination({
	currentPage,
	totalCount,
	itemsPerPage,
	onPageChange,
	isLoading = false,
}: PaginationProps) {
	// Don't render pagination if there's no data or it's loading
	if (isLoading || totalCount === 0) {
		return null;
	}

	const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

	// Don't render pagination if there's only one page
	if (totalPages <= 1) {
		return null;
	}

	// Generate page numbers for pagination
	const getPageNumbers = () => {
		const pages: number[] = [];
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

	const pageNumbers = getPageNumbers();

	// Don't render if we somehow got invalid page numbers
	if (pageNumbers.some((page) => isNaN(page))) {
		return null;
	}

	return (
		<nav className="flex items-center justify-center space-x-2">
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={() =>
							currentPage > 1 && onPageChange(currentPage - 1)
						}
						className={
							currentPage === 1
								? "pointer-events-none opacity-50"
								: "cursor-pointer"
						}
					/>
				</PaginationItem>

				{pageNumbers.map((page, index) => (
					<PaginationItem key={index}>
						{page === -1 ? (
							<span className="px-4">...</span>
						) : (
							<PaginationLink
								onClick={() => onPageChange(page)}
								isActive={page === currentPage}
								className={"cursor-pointer"}
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
							onPageChange(currentPage + 1)
						}
						className={
							currentPage === totalPages
								? "pointer-events-none opacity-50"
								: "cursor-pointer"
						}
					/>
				</PaginationItem>
			</PaginationContent>
		</nav>
	);
}
