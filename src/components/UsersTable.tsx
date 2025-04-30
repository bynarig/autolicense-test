import React from "react";
import Link from "next/link";
import { ArrowDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHeader,
	TableHead,
	TableRow,
} from "@/components/ui/table";
import { CopyableCell } from "./CopyableCell";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { User } from "@/types";

interface UsersTableProps {
	users: User[];
	caption?: string;
	detailsPath?: string;
}

/**
 * A reusable component for displaying users in a table with copy functionality
 */
export function UsersTable({
	users,
	caption = "A list of all users.",
	detailsPath = "/adminpanel/users",
}: UsersTableProps) {
	// Initialize clipboard functionality
	useCopyToClipboard();

	const formatDate = (date?: Date | string) => {
		if (!date) return "—";
		if (date instanceof Date) {
			return date.toLocaleDateString();
		}
		return new Date(date).toLocaleDateString();
	};

	return (
		<Table className="w-full">
			<TableCaption>{caption}</TableCaption>
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
				{users.length === 0 ? (
					<TableRow>
						<TableCell colSpan={7} className="text-center">
							No users found.
						</TableCell>
					</TableRow>
				) : (
					users.map((user, idx) => (
						<TableRow key={user.id}>
							<TableCell>
								<Link href={`${detailsPath}/${user.id}`}>
									<Button variant="ghost">{idx + 1}</Button>
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
									formatter={formatDate}
								/>
							</TableCell>
							<TableCell>
								<CopyableCell
									value={user.lastLogin}
									formatter={formatDate}
								/>
							</TableCell>
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
	);
}
