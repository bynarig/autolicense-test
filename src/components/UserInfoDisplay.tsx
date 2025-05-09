"use client";

import React from "react";
import { UserType } from "@/types";

// Use a subset of the User type for metadata display
type UserMetadata = Pick<
	Partial<UserType>,
	| "createdAt"
	| "lastLogin"
	| "updatedAt"
	| "subscriptionLVL"
	| "subscriptionType"
	| "subscriptionExpiresAt"
	| "emailVerified"
>;

interface UserInfoDisplayProps {
	userData: UserMetadata;
	className?: string;
	showSubscription?: boolean;
	showEmailVerification?: boolean;
}

export const UserInfoDisplay: React.FC<UserInfoDisplayProps> = ({
	userData,
	className = "text-2xl md:mb-[10px]",
	showSubscription = true,
	showEmailVerification = true,
}) => {
	// Format date objects to strings
	const formatDate = (date?: Date | string): string => {
		if (!date) return "N/A";
		if (date instanceof Date) {
			return date.toLocaleDateString();
		}
		return date;
	};

	return (
		<div className="flex flex-col">
			{/* Basic user metadata (read-only) */}
			<h3 className="text-lg font-semibold mb-2">
				Read-only Information
			</h3>
			<p className={className}>
				Created At: {formatDate(userData?.createdAt)}
			</p>
			<p className={className}>
				Last Login:{" "}
				{userData?.lastLogin?.toString() ||
					formatDate(userData?.createdAt).toString()}
			</p>
			<p className={className}>
				Edited At: {userData?.updatedAt?.toString() || "never"}
			</p>
		</div>
	);
};

export default UserInfoDisplay;
