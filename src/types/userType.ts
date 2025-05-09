export interface UserType {
	id?: string;
	email?: string | undefined;
	password?: string | undefined;
	username?: string | undefined;
	name?: string | undefined;
	avatarUrl?: string | undefined;
	createdAt?: Date;
	updatedAt?: Date | undefined;
	deletedAt?: Date | undefined;
	lastLogin?: Date | undefined;
	resetToken?: string | undefined;
	resetTokenExpiry?: Date | undefined;
	twoFactorEnabled?: boolean;
	twoFactorSecret?: string | undefined;
	emailVerified?: boolean;
	subscriptionLVL?: number;
	subscriptionType?: string | undefined;
	subscriptionExpiresAt?: Date | undefined;
	role?: UserRoleType | undefined;
}

export type UserRoleType = "UNAPPROVED" | "USER" | "ADMIN";
