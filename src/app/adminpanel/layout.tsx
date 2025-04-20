import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AdminStrict from "@/components/admin-strict";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Admin Panel | LII",
	description: "make your life in Ireland easier",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<Head>
				<link rel="icon" type="image/png" href="/favicon.png" />
			</Head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<SessionProvider>
						<SidebarProvider>
							<AppSidebar />
							<SidebarTrigger />
							<AdminStrict />
							{children}
						</SidebarProvider>
						<Toaster />
					</SessionProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
