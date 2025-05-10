"use client";

import React, { useCallback, useState } from "react";
import { searchSchema } from "@/validators/zod";
import { SearchForm } from "@/components/SearchForm";

import { UserType } from "@/types";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon } from "lucide-react";
import Link from "next/link";
import { CopyableCell } from "@/components/CopyableCell";
import { getUsers } from "@client/services/admin/users.service";
import Pagination from "@/components/Pagination";

/**
 * Client component for the users page with interactive features
 */
export default function Page() {
	const [users, setUsers] = useState<UserType[]>();
	const [totalCount, setTotalCount] = useState<number>();
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const itemsPerPage = 50;

	const handleSearch = useCallback(async (term: string) => {
		setSearchTerm(term);
		setCurrentPage(1);
		const result = await getUsers();
		setUsers(result.users);
		setTotalCount(result.totalCount);
	}, []);

	const handlePageChange = useCallback(
		async (page: number) => {
			setCurrentPage(page);
			const result = await getUsers();
			setUsers(result.users);
			setTotalCount(result.totalCount);
		},
		[searchTerm],
	);

	return (
		<div className="flex flex-col w-full my-6 space-y-6">
			<SearchForm
				onSearch={handleSearch}
				placeholder="search user"
				schema={searchSchema}
			/>

			<Table className="w-full">
				<TableCaption>all users here</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[5%]">№</TableHead>
						<TableHead className="w-[15%]">
							<Button variant="ghost">
								id
								<ArrowDownIcon />
							</Button>
						</TableHead>
						<TableHead className="w-[15%]">Name</TableHead>
						<TableHead className="w-[20%]">Email</TableHead>
						<TableHead className="w-[10%]">Role</TableHead>
						<TableHead className="w-[15%]">Registered at</TableHead>
						<TableHead className="w-[20%]">Latest active</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users?.length === 0 ? (
						<TableRow>
							<TableCell colSpan={7} className="text-center">
								No users found.
							</TableCell>
						</TableRow>
					) : (
						users?.map((user, idx) => (
							<TableRow key={user.id}>
								<TableCell>
									<Link href={`/adminpanel/users/${user.id}`}>
										<Button variant="ghost">
											{idx + 1}
										</Button>
									</Link>
								</TableCell>
								<TableCell className="font-medium">
									<CopyableCell value={user.id} />
								</TableCell>
								<TableCell>
									<CopyableCell value={user.name} />
								</TableCell>
								<TableCell>
									<CopyableCell value={user.email} />
								</TableCell>
								<TableCell>
									<CopyableCell value={user.role} />
								</TableCell>
								<TableCell>
									<CopyableCell
										value={user.createdAt}
										// formatter={formatDate}
									/>
								</TableCell>
								<TableCell>
									<CopyableCell
										value={user.lastLogin}
										// formatter={formatDate}
									/>
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
