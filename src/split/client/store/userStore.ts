"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UserType, UserRoleType } from "@/types";

interface UserState extends UserType {
	isSignedUp: boolean;
	lastLoginLocal: Date | undefined;
	login: (userData: {
		name: string;
		username: string;
		role: UserRoleType;
		id: string;
		email: string;
		avatarUrl?: string | undefined;
	}) => void;
	logout: () => void;
}

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			isSignedUp: false,
			lastLoginLocal: undefined,
			name: undefined,
			username: undefined,
			avatarUrl: undefined,
			role: undefined,
			id: undefined,
			email: undefined,
			login: ({
				name,
				username,
				role,
				id,
				email,
				avatarUrl = undefined,
			}) =>
				set({
					isSignedUp: true,
					lastLoginLocal: new Date(),
					name,
					username,
					role,
					id,
					email,
					avatarUrl,
				}),
			logout: () =>
				set({
					isSignedUp: false,
					name: undefined,
					username: undefined,
					role: undefined,
					id: undefined,
					email: undefined,
					avatarUrl: undefined,
				}),
		}),
		{
			name: "user-storage",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
