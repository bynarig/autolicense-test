"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { clientResetPassword } from "@/app/(root)/user/(auth)/auth-actions";

// Define the form schema with password validation
const formSchema = z
	.object({
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(100, "Password is too long"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export default function ResetPasswordPage() {
	const router = useRouter();
	const params = useParams();
	const token = params.token as string;

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Initialize the form
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	// Handle form submission
	async function onSubmit(data: {
		password: string;
		confirmPassword: string;
	}) {
		setIsSubmitting(true);
		setError(null);

		try {
			const res = await clientResetPassword({
				token,
				password: data.password,
			});

			if (res.ok) {
				setIsSuccess(true);
				// Redirect to login page after 3 seconds
				setTimeout(() => {
					router.push("/user/login");
				}, 3000);
			} else {
				const errorData = await res.json();
				setError(
					errorData.error ||
						"Failed to reset password. Please try again.",
				);
			}
		} catch (error) {
			console.error("Error resetting password:", error);
			setError("An unexpected error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<>
			<Navbar />
			<div className="flex justify-center h-140 mt-55">
				<div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
					{isSuccess ? (
						<div className="text-center">
							<h2 className="text-2xl font-bold mb-4">
								Password Reset Successful
							</h2>
							<p className="mb-4">
								Your password has been successfully reset.
							</p>
							<p className="mb-6">
								You will be redirected to the login page in a
								few seconds.
							</p>
							<Button
								type="button"
								onClick={() => router.push("/user/login")}
								className="w-full"
							>
								Go to Login
							</Button>
						</div>
					) : (
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6"
							>
								<div>
									<h2 className="text-2xl font-bold mb-2">
										Reset Your Password
									</h2>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										Please enter your new password below.
									</p>
								</div>

								{error && (
									<div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
										{error}
									</div>
								)}

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>New Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="Enter new password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Confirm Password
											</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="Confirm new password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									type="submit"
									className="w-full"
									disabled={isSubmitting}
								>
									{isSubmitting
										? "Resetting..."
										: "Reset Password"}
								</Button>
							</form>
						</Form>
					)}
				</div>
			</div>
			<Footer />
		</>
	);
}
