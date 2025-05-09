import { Role } from "@prisma/client";

export interface UserType {
	id: string;
	email: string | null;
	password?: string | null;
	username: string | null;
	name: string;
	avatarUrl: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	deletedAt: Date | null;
	lastLogin: Date | null;
	resetToken?: string | null;
	resetTokenExpiry?: Date | null;
	twoFactorEnabled: boolean;
	twoFactorSecret?: string | null;
	emailVerified: boolean;
	subscriptionLVL: number;
	subscriptionType?: string | null;
	subscriptionExpiresAt?: Date | null;
	role: Role;
}
