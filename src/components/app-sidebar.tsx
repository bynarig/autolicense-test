"use client";

import { User, Home, User2, ChevronUp, ScrollText } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { clientSignOut } from "@/app/(root)/user/(auth)/auth-actions";
import { useSession } from "next-auth/react";
import { Suspense } from "react";

// Menu items.
const items = [
	{
		title: "Home",
		url: "#",
		icon: Home,
	},
	// {
	// 	title: "Inbox",
	// 	url: "#",
	// 	icon: Inbox,
	// },
	{
		title: "Users",
		url: "/adminpanel/users",
		icon: User,
	},
	{
		title: "Tests",
		url: "/adminpanel/tests",
		icon: ScrollText,
	},
	// {
	// 	title: "Search",
	// 	url: "#",
	// 	icon: Search,
	// },
	// {
	// 	title: "Settings",
	// 	url: "#",
	// 	icon: Settings,
	// },
];

export function AppSidebar() {
	const { data: session } = useSession();

	return (
		<>
			{session && session.user ? (
				<Suspense fallback={<div>Loading...</div>}>
					<Sidebar>
						<SidebarContent>
							<SidebarGroup>
								<SidebarGroupLabel>
									Application
								</SidebarGroupLabel>
								<SidebarGroupContent>
									<SidebarMenu>
										{items.map((item) => (
											<SidebarMenuItem key={item.title}>
												<SidebarMenuButton asChild>
													<a href={item.url}>
														<item.icon />
														<span>
															{item.title}
														</span>
													</a>
												</SidebarMenuButton>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						</SidebarContent>
						<SidebarFooter>
							<SidebarMenu>
								<SidebarMenuItem>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<SidebarMenuButton>
												<User2 />{" "}
												{session?.user.name || "Admin"}
												<ChevronUp className="ml-auto" />
											</SidebarMenuButton>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											side="top"
											className="w-[--radix-popper-anchor-width]"
										>
											<DropdownMenuItem>
												<Link href="/user/profile">
													Account
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem>
												<span
													onClick={() =>
														clientSignOut()
													}
												>
													Sign out
												</span>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarFooter>
					</Sidebar>
				</Suspense>
			) : (
				<div>login to view info</div>
			)}
		</>
	);
}
