"use client";

import React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationDialogProps {
	title?: string;
	description?: string;
	triggerText?: string;
	cancelText?: string;
	confirmText?: string;
	onConfirm: () => void;
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link";
}

export const DeleteConfirmationDialog: React.FC<
	DeleteConfirmationDialogProps
> = ({
	title = "Are you absolutely sure?",
	description = "This action cannot be undone. This will permanently delete this data without any previous backups.",
	triggerText = "Delete",
	cancelText = "Cancel",
	confirmText = "Delete",
	onConfirm,
	variant = "outline",
}) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant={variant}>{triggerText}</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{cancelText}</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>
						{confirmText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteConfirmationDialog;
