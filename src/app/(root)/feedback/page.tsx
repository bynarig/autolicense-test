"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { useSessionWrapper } from "@/context/session-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the form schema using Zod
const formSchema = z.object({
	email: z.string().email("Invalid email address"),
	message: z.string().min(1, "Message is required"),
});

// Define the type for our form data
type FeedbackFormData = z.infer<typeof formSchema>;

export default function Page() {
	const { data: session, status } = useSessionWrapper();
	const router = useRouter();

	// Redirect to login if not authenticated
	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/user/login");
		}
	}, [status, router]);

	const form = useForm<FeedbackFormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: session?.user?.email || "",
			message: "",
		},
	});

	// Update email field when session changes
	useEffect(() => {
		if (session?.user?.email) {
			form.setValue("email", session.user.email);
		}
	}, [session, form]);

	function onSubmit(data: FeedbackFormData) {
		// Handle form submission
		console.log(data);
		// Reset form after submission
		form.reset();
	}

	return (
		<>
			<Navbar />
			<div className="flex justify-center h-140 mt-55">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8"
					>
						<p className="text-2xl font-bold">Feedback</p>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>E-mail</FormLabel>
									<FormControl>
										<Input
											placeholder="Your email address"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="message"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Message</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Your feedback message"
											className="min-h-[100px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Send Feedback</Button>
					</form>
				</Form>
			</div>
			<Footer />
		</>
	);
}
