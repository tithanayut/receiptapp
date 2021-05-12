import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";
import { itemsPerPage } from "../../../config";

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
		let data;
		try {
			data = await prisma.item.findMany({
				skip: (page - 1) * itemsPerPage,
				take: itemsPerPage,
				orderBy: {
					id: "asc",
				},
			});
		} catch {
			return res
				.status(500)
				.json({ errors: ["Database connection failed"] });
		} finally {
			await prisma.$disconnect();
		}

		return res.status(200).json({
			page,
			dataPerPage: itemsPerPage,
			data,
		});
	}

	return res.status(400).json({ errors: ["Method not supported"] });
};

export default handler;
