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
import { authSchema } from "@/validators/zod";
import { clientRegister } from "@/app/(root)/user/(auth)/auth-actions";
import { useSessionWrapper } from "@/context/session-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
	const { status, update } = useSessionWrapper();
	const router = useRouter();

	useEffect(() => {
		if (status === "authenticated") {
			router.push("/");
		}
	}, [status, router]);

	const form = useForm<z.infer<typeof authSchema>>({
		resolver: zodResolver(authSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(data: { email: string; password: string }) {
		const res = await clientRegister(data);

		if (res.ok) {
			await update();
		} else {
			const errorData = await res.json();
		}
		// TODO: extend error handling
	}

	return (
		<>
			<Navbar />
			<div className="flex justify-center h-140 mt-55">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8 "
					>
						<p className="text-2xl font-bold">Register</p>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>E-mail</FormLabel>
									<FormControl>
										<Input placeholder="email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											placeholder="password"
											type="password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Submit</Button>
						<Button
							type="button"
							variant="link"
							onClick={() => router.push("/user/login")}
						>
							login instead
						</Button>
					</form>
				</Form>
			</div>

			<Footer />
		</>
	);
}
