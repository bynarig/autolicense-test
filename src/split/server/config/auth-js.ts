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
			}
			return token;
		},
		async session({ session, token }) {
			if (token?.id) {
				session.user.id = token.id as string;
			}
			if (token?.role) session.user.role = token.role as string;

			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	trustHost: true,
});
