import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Bcrypt from "@/lib/bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		Credentials({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			authorize: async (credentials) => {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const user = await prisma.user.findUnique({
					where: { email: credentials.email as string },
				});

				if (!user || !user.password) {
					return null;
				}

				// Add password verification here
				const isValid = await Bcrypt.compare(
					credentials.password as string,
					user.password,
				);

				if (!isValid) {
					return null;
				}

				return user;
			},
		}),
	],
	pages: {
		signIn: "/user/login",
	},
	callbacks: {
		async jwt({ token, user }) {
			// If user object is provided, it means this is a sign-in event
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.avatarUrl = user.avatarUrl;
				token.name = user.name;
				token.username = user.username;
				token.editedAt = user.editedAt;
				token.lastLogin = user.lastLogin;
				token.createdAt = user.createdAt;
				token.subscriptionLVL = user.subscriptionLVL;
			} else if (token?.id) {
				// If no user but token exists, fetch the latest user data from the database
				// This ensures the token always has the most up-to-date user information
				const latestUser = await prisma.user.findUnique({
					where: { id: token.id as string },
					select: {
						name: true,
						username: true,
						role: true,
						avatarUrl: true,
						createdAt: true,
						editedAt: true,
					},
				});

				if (latestUser) {
					// Update token with latest user data
					token.name = latestUser.name;
					token.username = latestUser.username;
					token.role = latestUser.role;
					token.avatarUrl = latestUser.avatarUrl;
					token.createdAt = latestUser.createdAt;
					token.editedAt = latestUser.editedAt;
				}
			}
			return token;
		},
		async session({ session, token }) {
			if (token?.id) {
				session.user.id = token.id as string;
			}
			if (token?.role) session.user.role = token.role as string;
			if (token?.avatarUrl) {
				// Store the path in the session, the Navbar component will convert it to a full URL
				session.user.avatarUrl = token.avatarUrl as string;
			}
			if (token?.name) {
				session.user.name = token.name as string;
			}
			if (token?.username) {
				session.user.username = token.username as string;
			}
			if (token?.createdAt) {
				session.user.createdAt = token.createdAt as Date;
			}
			if (token?.editedAt) {
				session.user.editedAt = token.editedAt as Date;
			}

			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	trustHost: true,
});
