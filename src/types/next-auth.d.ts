// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
	interface User extends DefaultUser {
		id: string;
		role: string;
	}
	interface Session {
		user: {
			id: string;
			name: string;
			email: string;
			role: string;
			subscriptionLVL: number;
		} & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		role: string;
		subscriptionLVL: number;
	}
}
