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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { clientRequestPasswordReset } from "@/app/(root)/user/(auth)/auth-actions";
import { emailSchema } from "@/validators/zod";

export default function ForgotPasswordPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const form = useForm<z.infer<typeof emailSchema>>({
		resolver: zodResolver(emailSchema),
		defaultValues: {
			email: "",
		},
	});

	async function onSubmit(data: { email: string }) {
		setIsSubmitting(true);

		try {
			const res = await clientRequestPasswordReset(data);

			if (res.ok) {
				setIsSubmitted(true);
			}
		} catch (error) {
			console.error("Error requesting password reset:", error);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<>
			<Navbar />
			<div className="flex items-center justify-center h-[calc(100vh-64px)] py-12 px-4">
				{isSubmitted ? (
					<div className="max-w-md w-full p-6 bg-color-background rounded-lg shadow-md mx-auto">
						<h2 className="text-2xl font-bold mb-4">
							Check Your Email
						</h2>
						<p className="mb-4">
							If an account exists with the email you provided,
							we&apos;ve sent instructions to reset your password.
						</p>
						<p className="mb-6">
							Please check your email inbox and follow the link in
							the email to reset your password.
						</p>
						<Button
							type="button"
							onClick={() => router.push("/user/login")}
							className="w-full"
						>
							Return to Login
						</Button>
					</div>
				) : (
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-8 max-w-md w-full p-6 bg-color-background rounded-lg shadow-md mx-auto"
						>
							<div>
								<h2 className="text-2xl font-bold mb-2">
									Forgot Password
								</h2>
								<p className="text-gray-600 dark:text-gray-300">
									Enter your email address and we&apos;ll send
									you a link to reset your password.
								</p>
							</div>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter your email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="space-y-4">
								<Button
									type="submit"
									className="w-full"
									disabled={isSubmitting}
								>
									{isSubmitting
										? "Sending..."
										: "Send Reset Link"}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => router.push("/user/login")}
									className="w-full"
								>
									Back to Login
								</Button>
							</div>
						</form>
					</Form>
				)}
			</div>
			<Footer />
		</>
	);
}
