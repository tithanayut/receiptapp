import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";
import { payersPerPage } from "../../../config";

const handler = async (req, res) => {
	// Authentication
	const session = await getSession({ req });
	if (!session) {
		return res.status(401).json({ errros: ["Unauthorized"] });
	}

	if (req.method === "GET") {
		if (!req.query.page) {
			return res.status(400).json({ errors: ["Page not specified"] });
		}

		const page = Number(req.query.page);
		if (!Number.isInteger(page) || page < 1) {
			return res
				.status(400)
				.json({ errors: ["Cannot parse page number"] });
		}

		const prisma = new PrismaClient();
		const data = await prisma.payer.findMany({
			skip: (page - 1) * payersPerPage,
			take: payersPerPage,
			orderBy: {
				id: "asc",
			},
		});
		await prisma.$disconnect();

		return res.status(200).json({
			page,
			dataPerPage: payersPerPage,
			data,
		});
	}

	return res.status(400).json({ errors: ["Method not supported"] });
};

export default handler;
