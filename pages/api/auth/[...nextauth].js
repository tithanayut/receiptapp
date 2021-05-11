import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
	session: {
		jwt: true,
	},
	secret: process.env.SECRET,
	providers: [
		Providers.Credentials({
			async authorize(credentials) {
				// TODO
				throw Error("Login hasn't been implemented");
			},
		}),
	],
});
