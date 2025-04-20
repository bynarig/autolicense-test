"use client";

import Navbar from "@/shared/ui/basics/navbar/Navbar";
import Footer from "@/shared/ui/basics/Footer";

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
import { formSchema } from "@/shared/lib/zod";
import {
	clientRegister,
	clientSignIn,
} from "@/app/(root)/user/(auth)/auth-actions";
import { useSession } from "next-auth/react";

// interface Props {
//   params: Promise<{ slug: string[] }>;
//   searchParams: Promise<{ errors?: string }>;
// }

export default function Page() {
	const { status, update } = useSession();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
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
			// console.error("Login failed:", errorData.error)
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
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>E-mail</FormLabel>
									<FormControl>
										<Input placeholder="email" {...field} />
									</FormControl>
									{/*<FormDescription>*/}
									{/*    This is your email address that you registered with*/}
									{/*</FormDescription>*/}
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
									{/*<FormDescription>*/}
									{/*    This is your password that you registered with*/}
									{/*</FormDescription>*/}
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Submit</Button>
					</form>
				</Form>
			</div>
			{/*<div className="flex justify-center h-140 mt-55">*/}
			{/*  <form*/}
			{/*    className="card bg-base-100 w-96 shadow-sm"*/}
			{/*    action={async (formData) => {*/}
			{/*      "use server"*/}
			{/*      const data = {*/}
			{/*        name: formData.get("name") as string,*/}
			{/*        email: formData.get("email") as string,*/}
			{/*        password: formData.get("password") as string,*/}
			{/*      }*/}

			{/*      // Validate on server before submitting*/}
			{/*      const result = formSchema.safeParse(data)*/}
			{/*      if (!result.success) {*/}
			{/*        const errors: Record<string, string> = {}*/}
			{/*        result.error.errors.forEach((err) => {*/}
			{/*          errors[err.path[0]] = err.message*/}
			{/*        })*/}
			{/*        const searchParams = new URLSearchParams({*/}
			{/*          errors: JSON.stringify(errors),*/}
			{/*        }).toString();*/}
			{/*        redirect(`/user/register?${searchParams}`);*/}
			{/*      }*/}

			{/*      await signup(data)*/}
			{/*      redirect("/dashboard"); // Redirect to success page*/}
			{/*    }}*/}
			{/*  >*/}
			{/*    <div className="flex justify-center">*/}
			{/*      <h1 className="text-6xl">Register</h1>*/}
			{/*    </div>*/}
			{/*    <div className="card-body">*/}
			{/*      <input*/}
			{/*        name="email"*/}
			{/*        type="email"*/}
			{/*        placeholder="email"*/}
			{/*        className="input"*/}
			{/*        defaultValue=""*/}
			{/*      />*/}
			{/*      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}*/}

			{/*      <input*/}
			{/*        name="name"*/}
			{/*        type="text"*/}
			{/*        placeholder="name"*/}
			{/*        className="input"*/}
			{/*        defaultValue=""*/}
			{/*      />*/}
			{/*      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}*/}

			{/*      <input*/}
			{/*        name="password"*/}
			{/*        type="password"*/}
			{/*        placeholder="password"*/}
			{/*        className="input"*/}
			{/*        defaultValue=""*/}
			{/*      />*/}
			{/*      {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}*/}

			{/*      <button className="btn">Send</button>*/}
			{/*    </div>*/}
			{/*  </form>*/}
			{/*</div>*/}

			<Footer />
		</>
	);
}
