"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { components } from "@/data/navbar/data";
import { useSessionWrapper } from "@/context/session-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clientSignOut } from "@/app/(root)/user/(auth)/auth-actions";
import { Button } from "@/components/ui/button";
import imageUrl from "@/lib/image-url";
import { useIsMobile } from "@/hooks/use-mobile";
import { ModeToggle } from "@/components/ModeToggle";
import LanguageSwitch from "@/components/languageSwitch";

export default function Navbar() {
	const { data: session, status, avatarUrl } = useSessionWrapper();
	const isMobile = useIsMobile();
	const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	return (
		<header className="sticky top-0 z-50 w-full">
			{/* Glassy background */}
			<div className="absolute inset-0 bg-background/70 backdrop-blur-md border-b border-border/40"></div>

			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between relative z-10">
					{/* Logo/Brand */}
					<div className="flex items-center">
						<Link
							href="/"
							className="text-xl font-semibold text-foreground flex items-center gap-2"
						>
							<span className="text-primary">Ireland</span>FAQ
						</Link>
					</div>

					{/* Desktop Navigation */}
					{!isMobile && (
						<NavigationMenu className="hidden md:flex">
							<NavigationMenuList>
								<NavigationMenuItem>
									<Link href="/" legacyBehavior passHref>
										<NavigationMenuLink
											className={navigationMenuTriggerStyle()}
										>
											Home
										</NavigationMenuLink>
									</Link>
								</NavigationMenuItem>

								<NavigationMenuItem>
									<NavigationMenuTrigger>
										Services
									</NavigationMenuTrigger>
									<NavigationMenuContent>
										<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
											<ListItem
												href="/license/test"
												title="License Test"
											>
												Take your Irish driving license
												test online
											</ListItem>
											<ListItem
												href="/license/prices"
												title="Pricing"
											>
												View our subscription plans and
												pricing
											</ListItem>
											<ListItem
												href="/categories"
												title="Categories"
											>
												Browse information by categories
											</ListItem>
											<ListItem
												href="/why-us"
												title="Why Choose Us"
											>
												Learn why our service is the
												best choice
											</ListItem>
										</ul>
									</NavigationMenuContent>
								</NavigationMenuItem>

								<NavigationMenuItem>
									<NavigationMenuTrigger>
										Resources
									</NavigationMenuTrigger>
									<NavigationMenuContent>
										<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
											{components.map((component) => (
												<ListItem
													key={component.title}
													title={component.title}
													href={component.href}
												>
													{component.description}
												</ListItem>
											))}
										</ul>
									</NavigationMenuContent>
								</NavigationMenuItem>

								<NavigationMenuItem>
									<Link
										href="/feedback"
										legacyBehavior
										passHref
									>
										<NavigationMenuLink
											className={navigationMenuTriggerStyle()}
										>
											Feedback
										</NavigationMenuLink>
									</Link>
								</NavigationMenuItem>

								{status !== "loading" &&
									session?.user.role === "ADMIN" && (
										<NavigationMenuItem>
											<Link
												href="/adminpanel"
												legacyBehavior
												passHref
											>
												<NavigationMenuLink
													className={navigationMenuTriggerStyle()}
												>
													Admin
												</NavigationMenuLink>
											</Link>
										</NavigationMenuItem>
									)}
							</NavigationMenuList>
						</NavigationMenu>
					)}

					{/* User Menu / Login Button */}
					<div className="flex items-center gap-4">
						{/* Theme Toggle */}
						<div className="hidden md:flex">
							<ModeToggle />
						</div>

						{/* Language Switch */}
						<div className="hidden md:flex w-20">
							<LanguageSwitch />
						</div>

						{status === "loading" ? (
							<div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
						) : session ? (
							<DropdownMenu>
								<DropdownMenuTrigger className="focus:outline-none">
									<Avatar className="h-8 w-8 transition-transform hover:scale-105">
										<AvatarImage
											src={
												avatarUrl ||
												(session?.user?.avatarUrl
													? imageUrl.getImageUrl(
															session.user
																.avatarUrl,
														)
													: "https://avatars.githubusercontent.com/u/124599?v=4")
											}
											alt={session.user.name || "User"}
										/>
										<AvatarFallback>
											{session.user.name?.charAt(0) ||
												"U"}
										</AvatarFallback>
									</Avatar>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="w-56"
								>
									<DropdownMenuLabel>
										My Account
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<Link href="/user/profile">
										<DropdownMenuItem>
											<span>Profile</span>
										</DropdownMenuItem>
									</Link>
									<Link href="/user/profile">
										<DropdownMenuItem>
											<span>Billing</span>
										</DropdownMenuItem>
									</Link>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => clientSignOut()}
										className="text-destructive focus:text-destructive"
									>
										Sign out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Link href="/user/login">
								<Button
									variant="default"
									size="sm"
									className="rounded-full px-4"
								>
									Login
								</Button>
							</Link>
						)}

						{/* Mobile menu toggle */}
						{isMobile && (
							<Button
								variant="ghost"
								size="icon"
								onClick={toggleMobileMenu}
								className="md:hidden"
							>
								{mobileMenuOpen ? (
									<X className="h-5 w-5" />
								) : (
									<Menu className="h-5 w-5" />
								)}
							</Button>
						)}
					</div>
				</div>

				{/* Mobile Navigation Menu */}
				{isMobile && mobileMenuOpen && (
					<div className="md:hidden py-4 px-2 space-y-4 border-t border-border/40 bg-background/95 backdrop-blur-sm">
						<Link
							href="/"
							className="block py-2 px-3 text-foreground hover:bg-primary/10 rounded-md"
							onClick={() => setMobileMenuOpen(false)}
						>
							Home
						</Link>

						<div className="py-2 px-3 space-y-2">
							<div className="font-medium">Services</div>
							<div className="pl-2 space-y-2 border-l-2 border-primary/20">
								<Link
									href="/license/test"
									className="block py-1 px-2 text-sm text-muted-foreground hover:text-foreground"
									onClick={() => setMobileMenuOpen(false)}
								>
									License Test
								</Link>
								<Link
									href="/license/prices"
									className="block py-1 px-2 text-sm text-muted-foreground hover:text-foreground"
									onClick={() => setMobileMenuOpen(false)}
								>
									Pricing
								</Link>
								<Link
									href="/categories"
									className="block py-1 px-2 text-sm text-muted-foreground hover:text-foreground"
									onClick={() => setMobileMenuOpen(false)}
								>
									Categories
								</Link>
								<Link
									href="/why-us"
									className="block py-1 px-2 text-sm text-muted-foreground hover:text-foreground"
									onClick={() => setMobileMenuOpen(false)}
								>
									Why Choose Us
								</Link>
							</div>
						</div>

						<Link
							href="/feedback"
							className="block py-2 px-3 text-foreground hover:bg-primary/10 rounded-md"
							onClick={() => setMobileMenuOpen(false)}
						>
							Feedback
						</Link>

						{status !== "loading" &&
							session?.user.role === "ADMIN" && (
								<Link
									href="/adminpanel"
									className="block py-2 px-3 text-foreground hover:bg-primary/10 rounded-md"
									onClick={() => setMobileMenuOpen(false)}
								>
									Admin Panel
								</Link>
							)}

						{/* Theme and Language Controls for Mobile */}
						<div className="py-2 px-3 space-y-4 mt-4 border-t border-border/40 pt-4">
							<div className="font-medium">Settings</div>

							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">
									Theme
								</span>
								<ModeToggle />
							</div>

							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">
									Language
								</span>
								<div className="w-24">
									<LanguageSwitch />
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</header>
	);
}

const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className,
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">
						{title}
					</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";
