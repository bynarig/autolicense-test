import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { SessionProviderWrapper } from "@/context/session-context";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AdminStrict from "@/components/admin-strict";
import { ModeToggle } from "@/components/ModeToggle";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
	display: "swap",
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	display: "swap",
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export const metadata: Metadata = {
	title: "Admin Panel | LII",
	description: "Make your life in Ireland easier with our admin tools",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div
			className={`${geistSans.variable} ${geistMono.variable} antialiased`}
		>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<SessionProviderWrapper>
					<AdminStrict />
					<SidebarProvider>
						<AppSidebar />
						<SidebarTrigger />
						<div className="fixed top-4 right-4 z-50">
							<ModeToggle />
						</div>
						<main className="w-full">{children}</main>
					</SidebarProvider>
					<Toaster />
				</SessionProviderWrapper>
			</ThemeProvider>
		</div>
	);
}
