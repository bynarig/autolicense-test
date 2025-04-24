"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/shared/lib/utils";
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

import { components } from "@/shared/ui/basics/navbar/data";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clientSignOut } from "@/app/(root)/user/(auth)/auth-actions";
import { Button } from "@/components/ui/button";
import imageUrl from "@/shared/lib/image-url";
// import {ModeToggle} from "@/shared/ui/ModeToggle";

export default function Navbar() {
	const { data: session } = useSession();

	return (
		<div className="flex flex-row place-content-between ">
			<NavigationMenu className="md:mt-[5px] md:mb-[5px]">
				<NavigationMenuList>
					<NavigationMenuItem>
						<Link href="/" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
							>
								Main
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuTrigger>
							Getting started
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
								<li className="row-span-3">
									<NavigationMenuLink asChild>
										<Link
											className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
											href="/"
										>
											<div className="mb-2 mt-4 text-lg font-medium">
												shadcn/ui
											</div>
											<p className="text-sm leading-tight text-muted-foreground">
												Beautifully designed components
												that you can copy and paste into
												your apps. Accessible.
												Customizable. Open Source.
											</p>
										</Link>
									</NavigationMenuLink>
								</li>
								<ListItem href="/docs" title="Introduction">
									Re-usable components built using Radix UI
									and Tailwind CSS.
								</ListItem>
								<ListItem
									href="/docs/installation"
									title="Installation"
								>
									How to install dependencies and structure
									your app.
								</ListItem>
								<ListItem
									href="/docs/primitives/typography"
									title="Typography"
								>
									Styles for headings, paragraphs, lists...etc
								</ListItem>
							</ul>
						</NavigationMenuContent>

						<NavigationMenuTrigger>
							Components
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
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

						{session?.user.role === "ADMIN" ? (
							<Link href="/adminpanel">Admin panel</Link>
						) : null}
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>

			{session ? (
				<DropdownMenu>
					<DropdownMenuTrigger className="md:mr-[15px] md:mt-[5px] md:mb-[5px]">
						<Avatar>
							<AvatarImage
								src={
									session?.user?.avatarUrl
										? imageUrl.getImageUrl(
												session.user.avatarUrl,
											)
										: "https://avatars.githubusercontent.com/u/124599?v=4"
								}
								alt="@shadcn"
							/>
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<Link href="/user/profile">
							<DropdownMenuItem>Profile</DropdownMenuItem>
						</Link>
						<Link href="/user/profile">
							<DropdownMenuItem>Billing</DropdownMenuItem>
						</Link>
						<button onClick={() => clientSignOut()}>
							<DropdownMenuItem>SignOut</DropdownMenuItem>
						</button>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<Link
					href="/user/login"
					className="md:mr-[15px] md:mt-[5px] md:mb-[5px]"
				>
					<Button variant="default" size="icon">
						Login
					</Button>
				</Link>
			)}
		</div>
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
