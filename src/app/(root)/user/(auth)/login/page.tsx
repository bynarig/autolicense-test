"use client"

import Navbar from "@/shared/ui/basics/navbar/Navbar";
import Footer from "@/shared/ui/basics/Footer";

import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {zodResolver} from "@hookform/resolvers/zod";
import {formSchema} from "@/shared/lib/zod";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {clientSignIn} from "@/app/(root)/user/(auth)/auth-actions";


export default function Page() {
    const {status, update} = useSession()
    const router = useRouter()

    // Handle session-based redirect
    useEffect(() => {
        if (status === "authenticated") {
            router.push("/")
        }
    }, [status, router])

    async function onSubmit(data: {email: string; password: string}) {

        const res = await clientSignIn(data);

        if (res.ok) {
            await update() // Force session update
            // The useEffect will handle the redirect automatically
        } else {
            const errorData = await res.json()
            // Handle error display to user
            // console.error("Login failed:", errorData.error)
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return (
        <>
            <Navbar/>
            <div className="flex justify-center h-140 mt-55">
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="password" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
            <Footer/>
        </>
    );
}