"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	useRef,
	useCallback,
} from "react";
import { useSession as useNextAuthSession } from "next-auth/react";
import { Session } from "next-auth";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

// Define the shape of our context
type SessionContextType = {
	session: Session | null;
	status: "loading" | "authenticated" | "unauthenticated";
	update: () => Promise<Session | null>;
	avatarUrl: string | null; // Cached avatar URL
};

// Create the context with a default value
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Cache key for localStorage
const SESSION_CACHE_KEY = "next-auth-session-cache";
const STATUS_CACHE_KEY = "next-auth-status-cache";
const TIMESTAMP_CACHE_KEY = "next-auth-timestamp-cache";
const AVATAR_CACHE_KEY = "next-auth-avatar-cache";

// Cache expiration time (in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

// Provider component that wraps the app and makes session data available
export function SessionProvider({ children }: { children: React.ReactNode }) {
	// Use the original useSession hook but only for initial data and updates
	const {
		data: originalSession,
		status: originalStatus,
		update: originalUpdate,
	} = useNextAuthSession();

	// State to store cached session data
	const [cachedSession, setCachedSession] = useState<Session | null>(null);
	const [cachedStatus, setCachedStatus] = useState<
		"loading" | "authenticated" | "unauthenticated"
	>("loading");
	const [cachedAvatarUrl, setCachedAvatarUrl] = useState<string | null>(null);

	// Ref to track if we've initialized from cache
	const initializedRef = useRef(false);
	// Ref to track if we're currently updating
	const isUpdatingRef = useRef(false);

	// Custom update function that updates the cache
	const updateWithCache = useCallback(async () => {
		if (isUpdatingRef.current) return originalSession;

		isUpdatingRef.current = true;
		try {
			const updatedSession = await originalUpdate();

			// Update cache with new session data
			if (updatedSession) {
				// Update state first (this always works)
				setCachedSession(updatedSession);
				setCachedStatus("authenticated");

				// Update avatar URL cache if available
				if (updatedSession.user?.avatarUrl) {
					import("@/split/client/services/image.service").then(
						(imageUrlModule) => {
							const fullAvatarUrl =
								imageUrlModule.default.getImageUrl(
									updatedSession.user.avatarUrl,
								);
							setCachedAvatarUrl(fullAvatarUrl);

							// Try to update localStorage
							if (typeof window !== "undefined") {
								try {
									localStorage.setItem(
										AVATAR_CACHE_KEY,
										fullAvatarUrl,
									);
								} catch (error) {
									console.error(
										"Error saving avatar URL to cache:",
										error,
									);
								}
							}
						},
					);
				} else {
					setCachedAvatarUrl(null);
					if (typeof window !== "undefined") {
						try {
							localStorage.removeItem(AVATAR_CACHE_KEY);
						} catch (error) {
							console.error(
								"Error removing avatar URL from cache:",
								error,
							);
						}
					}
				}

				// Then try to update localStorage (might fail in some environments)
				if (typeof window !== "undefined") {
					try {
						localStorage.setItem(
							SESSION_CACHE_KEY,
							JSON.stringify(updatedSession),
						);
						localStorage.setItem(STATUS_CACHE_KEY, "authenticated");
						localStorage.setItem(
							TIMESTAMP_CACHE_KEY,
							Date.now().toString(),
						);
					} catch (error) {
						console.error("Error saving session to cache:", error);
					}
				}
			} else {
				// Update state first
				setCachedSession(null);
				setCachedStatus("unauthenticated");
				setCachedAvatarUrl(null);

				// Then try to update localStorage
				if (typeof window !== "undefined") {
					try {
						localStorage.removeItem(SESSION_CACHE_KEY);
						localStorage.setItem(
							STATUS_CACHE_KEY,
							"unauthenticated",
						);
						localStorage.removeItem(TIMESTAMP_CACHE_KEY);
						localStorage.removeItem(AVATAR_CACHE_KEY);
					} catch (error) {
						console.error(
							"Error clearing session from cache:",
							error,
						);
					}
				}
			}

			return updatedSession;
		} finally {
			isUpdatingRef.current = false;
		}
	}, [
		originalSession,
		originalUpdate,
		setCachedSession,
		setCachedStatus,
		setCachedAvatarUrl,
	]);

	// Initialize from cache on first render
	useEffect(() => {
		if (initializedRef.current) return;
		initializedRef.current = true;

		// Only run in browser environment
		if (typeof window === "undefined") return;

		try {
			// Try to load session from cache
			const cachedSessionJson = localStorage.getItem(SESSION_CACHE_KEY);
			const cachedStatusValue = localStorage.getItem(STATUS_CACHE_KEY);
			const cachedTimestampValue =
				localStorage.getItem(TIMESTAMP_CACHE_KEY);
			const cachedAvatarValue = localStorage.getItem(AVATAR_CACHE_KEY);

			// Check if cache is still valid
			const isExpired =
				!cachedTimestampValue ||
				Date.now() - parseInt(cachedTimestampValue, 10) >
					CACHE_EXPIRATION;

			if (isExpired) {
				// Clear expired cache
				localStorage.removeItem(SESSION_CACHE_KEY);
				localStorage.removeItem(STATUS_CACHE_KEY);
				localStorage.removeItem(TIMESTAMP_CACHE_KEY);
				localStorage.removeItem(AVATAR_CACHE_KEY);
				console.log("Session cache expired, cleared cache");
				return;
			}

			if (cachedSessionJson) {
				try {
					const parsedSession = JSON.parse(cachedSessionJson);
					setCachedSession(parsedSession);
				} catch (parseError) {
					console.error("Error parsing cached session:", parseError);
					// Clear invalid cache
					localStorage.removeItem(SESSION_CACHE_KEY);
					localStorage.removeItem(STATUS_CACHE_KEY);
					localStorage.removeItem(TIMESTAMP_CACHE_KEY);
					localStorage.removeItem(AVATAR_CACHE_KEY);
				}
			}

			if (
				cachedStatusValue === "authenticated" ||
				cachedStatusValue === "unauthenticated"
			) {
				setCachedStatus(cachedStatusValue);
			}

			if (cachedAvatarValue) {
				setCachedAvatarUrl(cachedAvatarValue);
			}
		} catch (error) {
			console.error("Error loading session from cache:", error);
			// localStorage might not be available (e.g., in private browsing mode)
		}
	}, []);

	// Update cache when original session changes
	useEffect(() => {
		// Update state first (this always works)
		if (originalSession) {
			setCachedSession(originalSession);
			setCachedStatus("authenticated");

			// Update avatar URL cache if available
			if (originalSession.user?.avatarUrl) {
				import("@/split/client/services/image.service").then(
					(imageUrlModule) => {
						const fullAvatarUrl =
							imageUrlModule.default.getImageUrl(
								originalSession.user.avatarUrl,
							);
						setCachedAvatarUrl(fullAvatarUrl);

						// Try to update localStorage
						if (typeof window !== "undefined") {
							try {
								localStorage.setItem(
									AVATAR_CACHE_KEY,
									fullAvatarUrl,
								);
							} catch (error) {
								console.error(
									"Error saving avatar URL to cache:",
									error,
								);
							}
						}
					},
				);
			} else {
				setCachedAvatarUrl(null);
				if (typeof window !== "undefined") {
					try {
						localStorage.removeItem(AVATAR_CACHE_KEY);
					} catch (error) {
						console.error(
							"Error removing avatar URL from cache:",
							error,
						);
					}
				}
			}
		} else if (originalStatus === "unauthenticated") {
			setCachedSession(null);
			setCachedStatus("unauthenticated");
			setCachedAvatarUrl(null);
		}

		// Then try to update localStorage (might fail in some environments)
		if (typeof window !== "undefined") {
			try {
				if (originalSession) {
					localStorage.setItem(
						SESSION_CACHE_KEY,
						JSON.stringify(originalSession),
					);
					localStorage.setItem(STATUS_CACHE_KEY, "authenticated");
					localStorage.setItem(
						TIMESTAMP_CACHE_KEY,
						Date.now().toString(),
					);
				} else if (originalStatus === "unauthenticated") {
					localStorage.removeItem(SESSION_CACHE_KEY);
					localStorage.setItem(STATUS_CACHE_KEY, "unauthenticated");
					localStorage.removeItem(TIMESTAMP_CACHE_KEY);
					localStorage.removeItem(AVATAR_CACHE_KEY);
				}
			} catch (error) {
				console.error("Error updating session cache:", error);
			}
		}
	}, [originalSession, originalStatus]);

	// Update session on page reload
	useEffect(() => {
		// Only run in browser environment
		if (typeof window !== "undefined") {
			// Update session when page is loaded/reloaded
			const handlePageLoad = () => {
				updateWithCache();
			};

			// Listen for page load events
			window.addEventListener("load", handlePageLoad);

			// Clean up event listener
			return () => {
				window.removeEventListener("load", handlePageLoad);
			};
		}
	}, [updateWithCache]);

	// Use cached values if available, otherwise use original values
	const session = cachedSession || originalSession;
	const status = cachedStatus !== "loading" ? cachedStatus : originalStatus;

	// Return the provider with the cached session values
	return (
		<SessionContext.Provider
			value={{
				session,
				status,
				update: updateWithCache,
				avatarUrl: cachedAvatarUrl,
			}}
		>
			{children}
		</SessionContext.Provider>
	);
}

// Function to clear the session cache
export function clearSessionCache() {
	if (typeof window === "undefined") return;

	try {
		localStorage.removeItem(SESSION_CACHE_KEY);
		localStorage.removeItem(STATUS_CACHE_KEY);
		localStorage.removeItem(TIMESTAMP_CACHE_KEY);
		localStorage.removeItem(AVATAR_CACHE_KEY);
		console.log("Session cache cleared manually");
	} catch (error) {
		console.error("Error clearing session cache:", error);
	}
}

// Custom hook to use the session context
export function useSessionWrapper() {
	const context = useContext(SessionContext);

	if (context === undefined) {
		throw new Error(
			"useSessionWrapper must be used within a SessionProvider",
		);
	}

	return {
		data: context.session,
		status: context.status,
		update: context.update,
		clearCache: clearSessionCache,
		avatarUrl: context.avatarUrl,
	};
}

// This is a drop-in replacement for the original SessionProvider from next-auth/react
// It combines the next-auth SessionProvider with our custom SessionProvider
export function SessionProviderWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<NextAuthSessionProvider>
			<SessionProvider>{children}</SessionProvider>
		</NextAuthSessionProvider>
	);
}
