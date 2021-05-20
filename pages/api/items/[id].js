import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";

const handler = async (req, res) => {
	// Authentication
	const session = await getSession({ req });
	if (!session) {
		return res.status(401).json({ errros: ["Unauthorized"] });
	}

	const id = req.query.id;

	if (req.method === "GET") {
		const prisma = new PrismaClient();
		let data;
		try {
			data = await prisma.item.findUnique({
				where: {
					id,
				},
			});
		} catch {
			return res
				.status(500)
				.json({ errors: ["Database connection failed"] });
		} finally {
			await prisma.$disconnect();
		}

		if (!data) {
			return res.status(404).json({ errors: ["Item not found"] });
		}
		return res.status(200).json(data);
	} else if (req.method === "PUT") {
		if (
			!req.body.name ||
			typeof req.body.price !== "number" ||
			typeof req.body.allowAdjustPrice === "undefined"
		) {
			return res
				.status(400)
				.json({ errors: ["Request body not complete or is invalid"] });
		}

		const prisma = new PrismaClient();
		let data;
		try {
			data = await prisma.item.update({
				where: {
					id,
				},
				data: {
					name: req.body.name,
					price: req.body.price,
					allowAjustPrice: req.body.allowAdjustPrice,
				},
			});
		} catch {
			return res
				.status(500)
				.json({ errors: ["Database connection failed"] });
		} finally {
			await prisma.$disconnect();
		}

		return res.status(200).json({ message: "Updated", data });
	}

	return res.status(405).json({ errors: ["Method not supported"] });
};

export default handler;
