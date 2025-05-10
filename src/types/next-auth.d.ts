// types/next-auth.d.ts
import NextAuth from "next-auth";
import { UserType } from "@/types/userType";

declare module "next-auth" {
	interface User extends DefaultUser {
		id: string;
		role: string;
	}

	interface Session {
		user: Partial<UserType> & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		role: string;
	}
}
