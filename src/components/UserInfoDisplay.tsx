"use client";

import React from "react";

interface UserMetadata {
	createdAt?: Date;
	lastLogin?: string;
	editedAt?: string;
	subscriptionLVL?: string;
	subscriptionType?: string;
	subscriptionExpiresAt?: string;
	emailVerified?: boolean;
}

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
				{userData?.lastLogin || formatDate(userData?.createdAt)}
			</p>
			<p className={className}>
				Edited At: {userData?.editedAt || "never"}
			</p>
		</div>
	);
};

export default UserInfoDisplay;
