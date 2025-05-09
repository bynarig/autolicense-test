// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
	interface User extends DefaultUser {
		id: string;
		role: string;
		avatarUrl: string | null;
		username: string | null;
		updatedAt: Date | null;
		lastLogin: Date | null;
		createdAt: Date | null;
		subscriptionLVL: number;
	}

	interface Session {
		user: {
			id: string;
			name: string;
			username: string;
			email: string | null;
			role: string;
			avatarUrl: string | null;
			updatedAt: Date | null;
			lastLogin: Date | null;
			createdAt: Date | null;
			subscriptionLVL: number;
		} & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		name: string;
		username: string;
		email: string | null;
		role: string;
		avatarUrl: string | null;
		updatedAt: Date | null;
		lastLogin: Date | null;
		createdAt: Date | null;
		subscriptionLVL: number;
	}
}
