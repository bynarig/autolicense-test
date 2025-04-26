"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, CreditCard, Lock, Settings, User, BookOpen, Clock } from "lucide-react";
import imageUrl from "@/lib/image-url";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Page() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const isMobile = useIsMobile();
	const [activeTab, setActiveTab] = useState("profile");

	useEffect(() => {
		// Only redirect if we're definitely not authenticated (not during loading)
		if (status === "unauthenticated") {
			router.push("/user/login");
		}
	}, [status, router]);

	// Show loading state while session is being determined
	if (status === "loading") {
		return (
			<>
				<Navbar />
				<div className="container mx-auto py-20 flex justify-center items-center">
					<div className="flex flex-col items-center gap-4">
						<div className="h-16 w-16 rounded-full bg-muted animate-pulse"></div>
						<p className="text-muted-foreground">Checking authentication...</p>
					</div>
				</div>
				<Footer />
			</>
		);
	}

	// Format dates for display
	const formatDate = (dateString) => {
		if (!dateString) return "N/A";
		try {
			return format(new Date(dateString), "PPP");
		} catch (e) {
			return "Invalid date";
		}
	};

	// Get subscription status
	const getSubscriptionStatus = () => {
		if (!session?.user?.subscriptionExpiresAt) return "No active subscription";

		const expiryDate = new Date(session.user.subscriptionExpiresAt);
		const now = new Date();

		if (expiryDate < now) {
			return "Expired";
		}

		return "Active";
	};

	// Get subscription badge color
	const getSubscriptionBadgeColor = () => {
		if (!session?.user?.subscriptionExpiresAt) return "secondary";

		const expiryDate = new Date(session.user.subscriptionExpiresAt);
		const now = new Date();

		if (expiryDate < now) {
			return "destructive";
		}

		return "success";
	};

	return (
		<>
			<Navbar />
			<main className="container mx-auto py-6 px-4 md:py-10">
				{session && session.user ? (
					<Suspense fallback={<div className="flex justify-center"><div className="h-16 w-16 rounded-full bg-muted animate-pulse"></div></div>}>
						<div className="max-w-5xl mx-auto">
							{/* Profile Header */}
							<div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
								<Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
									<AvatarImage
										src={session.user.avatarUrl
											? imageUrl.getImageUrl(session.user.avatarUrl)
											: "https://avatars.githubusercontent.com/u/124599?v=4"}
										alt={session.user.name || "User"}
									/>
									<AvatarFallback className="text-2xl">{session.user.name?.charAt(0) || "U"}</AvatarFallback>
								</Avatar>

								<div className="flex flex-col items-center md:items-start">
									<h1 className="text-2xl md:text-3xl font-bold">{session.user.name}</h1>
									<p className="text-muted-foreground">{session.user.email}</p>

									<div className="flex flex-wrap gap-2 mt-2">
										<Badge variant="outline" className="capitalize">
											{session.user.role?.toLowerCase() || "User"}
										</Badge>

										{session.user.subscriptionLVL > 0 && (
											<Badge variant={getSubscriptionBadgeColor()}>
												{getSubscriptionStatus()}
											</Badge>
										)}

										{session.user.emailVerified && (
											<Badge variant="secondary">
												Verified Email
											</Badge>
										)}
									</div>
								</div>

								<div className="md:ml-auto flex flex-col gap-2">
									<Button asChild size="sm">
										<Link href="/license/test">
											Take License Test
										</Link>
									</Button>
								</div>
							</div>

							{/* Tabs Navigation */}
							<Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab} value={activeTab}>
								<TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
									<TabsTrigger value="profile" className="flex items-center gap-2">
										<User className="h-4 w-4" />
										<span className={isMobile ? "hidden" : "inline"}>Profile</span>
									</TabsTrigger>
									<TabsTrigger value="subscription" className="flex items-center gap-2">
										<CreditCard className="h-4 w-4" />
										<span className={isMobile ? "hidden" : "inline"}>Subscription</span>
									</TabsTrigger>
									<TabsTrigger value="security" className="flex items-center gap-2">
										<Lock className="h-4 w-4" />
										<span className={isMobile ? "hidden" : "inline"}>Security</span>
									</TabsTrigger>
									<TabsTrigger value="activity" className="flex items-center gap-2">
										<Clock className="h-4 w-4" />
										<span className={isMobile ? "hidden" : "inline"}>Activity</span>
									</TabsTrigger>
								</TabsList>

								{/* Profile Tab */}
								<TabsContent value="profile">
									<Card>
										<CardHeader>
											<CardTitle>Personal Information</CardTitle>
											<CardDescription>
												View and manage your personal information
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<h3 className="text-sm font-medium text-muted-foreground mb-1">Full Name</h3>
													<p className="text-foreground">{session.user.name || "Not provided"}</p>
												</div>
												<div>
													<h3 className="text-sm font-medium text-muted-foreground mb-1">Email Address</h3>
													<p className="text-foreground">{session.user.email || "Not provided"}</p>
												</div>
												<div>
													<h3 className="text-sm font-medium text-muted-foreground mb-1">Username</h3>
													<p className="text-foreground">{session.user.username || "Not provided"}</p>
												</div>
												<div>
													<h3 className="text-sm font-medium text-muted-foreground mb-1">Account Created</h3>
													<p className="text-foreground">{formatDate(session.user.createdAt)}</p>
												</div>
												<div>
													<h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
													<p className="text-foreground">{formatDate(session.user.editedAt) || "Never"}</p>
												</div>
												<div>
													<h3 className="text-sm font-medium text-muted-foreground mb-1">Last Login</h3>
													<p className="text-foreground">{formatDate(session.user.lastLogin) || "Unknown"}</p>
												</div>
											</div>
										</CardContent>
										<CardFooter>
											<Button variant="outline" className="w-full md:w-auto">
												Edit Profile
											</Button>
										</CardFooter>
									</Card>
								</TabsContent>

								{/* Subscription Tab */}
								<TabsContent value="subscription">
									<Card>
										<CardHeader>
											<CardTitle>Subscription Details</CardTitle>
											<CardDescription>
												Manage your subscription and billing information
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<h3 className="text-sm font-medium text-muted-foreground mb-1">Subscription Status</h3>
													<div className="flex items-center gap-2">
														<Badge variant={getSubscriptionBadgeColor()}>
															{getSubscriptionStatus()}
														</Badge>
													</div>
												</div>
												<div>
													<h3 className="text-sm font-medium text-muted-foreground mb-1">Subscription Type</h3>
													<p className="text-foreground capitalize">{session.user.subscriptionType || "None"}</p>
												</div>
												<div>
													<h3 className="text-sm font-medium text-muted-foreground mb-1">Subscription Level</h3>
													<p className="text-foreground">{session.user.subscriptionLVL || "0"}</p>
												</div>
												<div>
													<h3 className="text-sm font-medium text-muted-foreground mb-1">Expiration Date</h3>
													<div className="flex items-center gap-2">
														<CalendarIcon className="h-4 w-4 text-muted-foreground" />
														<span>{formatDate(session.user.subscriptionExpiresAt)}</span>
													</div>
												</div>
											</div>

											<Separator className="my-4" />

											<div className="rounded-lg border p-4">
												<h3 className="font-medium mb-2">Upgrade Your Subscription</h3>
												<p className="text-sm text-muted-foreground mb-4">
													Get access to premium features and unlimited tests with our premium plans.
												</p>
												<Button asChild>
													<Link href="/license/prices">View Plans</Link>
												</Button>
											</div>
										</CardContent>
									</Card>
								</TabsContent>

								{/* Security Tab */}
								<TabsContent value="security">
									<Card>
										<CardHeader>
											<CardTitle>Security Settings</CardTitle>
											<CardDescription>
												Manage your account security and privacy
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-1 gap-4">
												<div className="flex items-center justify-between p-4 border rounded-lg">
													<div>
														<h3 className="font-medium">Email Verification</h3>
														<p className="text-sm text-muted-foreground">
															{session.user.emailVerified
																? "Your email has been verified"
																: "Please verify your email address"}
														</p>
													</div>
													<Badge variant={session.user.emailVerified ? "success" : "destructive"}>
														{session.user.emailVerified ? "Verified" : "Unverified"}
													</Badge>
												</div>

												<div className="flex items-center justify-between p-4 border rounded-lg">
													<div>
														<h3 className="font-medium">Two-Factor Authentication</h3>
														<p className="text-sm text-muted-foreground">
															{session.user.twoFactorEnabled
																? "Two-factor authentication is enabled"
																: "Add an extra layer of security to your account"}
														</p>
													</div>
													<Badge variant={session.user.twoFactorEnabled ? "success" : "secondary"}>
														{session.user.twoFactorEnabled ? "Enabled" : "Disabled"}
													</Badge>
												</div>

												<div className="flex items-center justify-between p-4 border rounded-lg">
													<div>
														<h3 className="font-medium">Password</h3>
														<p className="text-sm text-muted-foreground">
															Change your password regularly for better security
														</p>
													</div>
													<Button variant="outline" size="sm">
														Change Password
													</Button>
												</div>
											</div>
										</CardContent>
									</Card>
								</TabsContent>

								{/* Activity Tab */}
								<TabsContent value="activity">
									<Card>
										<CardHeader>
											<CardTitle>Recent Activity</CardTitle>
											<CardDescription>
												View your recent tests and activity
											</CardDescription>
										</CardHeader>
										<CardContent>
											{session.user.test && session.user.test.length > 0 ? (
												<div className="space-y-4">
													{session.user.test.map((test, index) => (
														<div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
															<BookOpen className="h-5 w-5 text-primary mt-1" />
															<div>
																<h3 className="font-medium">{test.title || "Untitled Test"}</h3>
																<p className="text-sm text-muted-foreground">
																	{formatDate(test.createdAt)}
																</p>
																{test.score && (
																	<Badge className="mt-2">
																		Score: {test.score}/{test.maxScore || "?"}
																	</Badge>
																)}
															</div>
														</div>
													))}
												</div>
											) : (
												<div className="text-center py-8">
													<BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
													<h3 className="text-lg font-medium mb-2">No activity yet</h3>
													<p className="text-muted-foreground mb-4">
														You haven't taken any tests or quizzes yet.
													</p>
													<Button asChild>
														<Link href="/license/test">Take a Test</Link>
													</Button>
												</div>
											)}
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>
					</Suspense>
				) : (
					<div className="flex flex-col items-center justify-center py-20">
						<div className="text-center max-w-md">
							<h2 className="text-2xl font-bold mb-4">Login Required</h2>
							<p className="text-muted-foreground mb-6">
								Please log in to view your profile information and account details.
							</p>
							<Button asChild>
								<Link href="/user/login">Login to Your Account</Link>
							</Button>
						</div>
					</div>
				)}
			</main>
			<Footer />
		</>
	);
}
