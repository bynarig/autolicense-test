"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

// Define the validation schema for the form
const userFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	username: z.string().min(1, "Username is required"),
	email: z.string().email("Invalid email address"),
	role: z.string().min(1, "Role is required"),
	password: z.string().optional(),
	adminPassword: z.string().optional(),
	subscriptionExpiresAt: z.date().optional(),
	avatarUrl: z.string().optional(),
	subscriptionLVL: z.string().optional(),
	subscriptionType: z.string().optional(),
	emailVerified: z.boolean().optional(),
});

export type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormProps {
	initialData?: Partial<UserFormData>;
	onSubmit: (data: UserFormData) => Promise<void>;
	roles?: { value: string; label: string }[];
}

export const UserForm: React.FC<UserFormProps> = ({
	initialData = {},
	onSubmit,
	roles = [
		{ value: "UNAPPROVED", label: "UNAPPROVED" },
		{ value: "USER", label: "USER" },
		{ value: "ADMIN", label: "ADMIN" },
	],
}) => {
	const [showAdminPassword, setShowAdminPassword] = React.useState(false);

	const form = useForm<UserFormData>({
		defaultValues: {
			name: initialData.name || "",
			username: initialData.username || "",
			email: initialData.email || "",
			role: initialData.role || "",
			password: initialData.password || "",
			adminPassword: "",
			subscriptionExpiresAt:
				initialData.subscriptionExpiresAt || new Date("1900-01-01"),
			avatarUrl: initialData.avatarUrl || "",
			subscriptionLVL: initialData.subscriptionLVL || "",
			subscriptionType: initialData.subscriptionType || "",
			emailVerified: initialData.emailVerified || false,
		},
	});

	// Watch the password field to show/hide admin password field
	const passwordValue = form.watch("password");
	React.useEffect(() => {
		setShowAdminPassword(!!passwordValue);
	}, [passwordValue]);

	const handleSubmit = async (data: UserFormData) => {
		await onSubmit(data);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-2"
			>
				<div className="flex">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder="Name"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex">
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder="Username"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder="Email"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex">
					<FormField
						control={form.control}
						name="role"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Role</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a role" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{roles.map((role) => (
											<SelectItem
												key={role.value}
												value={role.value}
											>
												{role.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex">
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder="Set new password"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Admin Password field - only shown when password field has a value */}
				{showAdminPassword && (
					<div className="flex">
						<FormField
							control={form.control}
							name="adminPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Your Admin Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Enter your admin password to confirm"
											{...field}
											required={!!passwordValue}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				)}
				<FormField
					control={form.control}
					name="subscriptionExpiresAt"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Subscription Expires At</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={"outline"}
											className={cn(
												"w-[240px] pl-3 text-left font-normal",
												!field.value &&
													"text-muted-foreground",
											)}
										>
											{field.value ? (
												format(field.value, "PPP")
											) : (
												<span>Select date</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent
									className="w-auto p-0"
									align="start"
								>
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Subscription Level */}
				<div className="flex">
					<FormField
						control={form.control}
						name="subscriptionLVL"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Subscription Level</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder="Subscription Level"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Subscription Type */}
				<div className="flex">
					<FormField
						control={form.control}
						name="subscriptionType"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Subscription Type</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder="Subscription Type"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Email Verified */}
				<div className="flex">
					<FormField
						control={form.control}
						name="emailVerified"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email Verified</FormLabel>
								<Select
									onValueChange={(value) =>
										field.onChange(value === "true")
									}
									defaultValue={
										field.value ? "true" : "false"
									}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Email Verified Status" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="true">
											Yes
										</SelectItem>
										<SelectItem value="false">
											No
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button type="submit">Save User Data</Button>
			</form>
		</Form>
	);
};

export default UserForm;
