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
import { useSessionWrapper } from "@/components/context/session-context";
import { Suspense } from "react";
import { useUserStore } from "@client/store/userStore";

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
	const userStore = useUserStore();
	return (
		<>
			<Sidebar>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Application</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild>
											<Link href={item.url}>
												<item.icon />
												<span>{item.title}</span>
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
										<User2 /> {userStore.name || "Admin"}
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
		</>
	);
}
