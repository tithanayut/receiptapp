import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { PrismaClient } from "@prisma/client";
import { validate } from "../../../utils/password";

export default NextAuth({
	session: {
		jwt: true,
	},
	secret: process.env.SECRET,
	providers: [
		Providers.Credentials({
			async authorize(credentials) {
				if (!credentials.username || !credentials.password) {
					throw new Error("Please type in username and password");
				}

				const username = credentials.username.trim().toLowerCase();

				// Query from DB
				const prisma = new PrismaClient();
				let user;
				try {
					user = await prisma.appUser.findUnique({
						where: {
							username,
						},
					});
				} catch {
					return res
						.status(500)
						.json({ errors: ["Database connection failed"] });
				} finally {
					await prisma.$disconnect();
				}

				// Check if user exists
				if (!user) {
					throw new Error("Username or password incorrect");
				}

				// Compare password
				const result = await validate(
					credentials.password,
					user.password
				);
				if (!result) {
					throw new Error("Username or password incorrect");
				}

				return {
					id: username,
				};
			},
		}),
	],
});
