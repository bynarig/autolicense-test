"use client";

import {
	ChevronUp,
	Home,
	ScrollText,
	ShieldQuestionIcon,
	User,
	User2,
} from "lucide-react";

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
import { clientSignOut } from "@client/services/auth.service";
import { useSessionWrapper } from "@/context/session-context";
import { Suspense } from "react";

// Menu items.
const items = [
	{
		title: "Home",
		url: "/adminpanel",
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
	{
		title: "Questions",
		url: "/adminpanel/tests/questions",
		icon: ShieldQuestionIcon,
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
	const { data: session } = useSessionWrapper();

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
													<Link href={item.url}>
														<item.icon />
														<span>
															{item.title}
														</span>
													</Link>
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
											<DropdownMenuItem
												onClick={() => clientSignOut()}
											>
												Sign out
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
