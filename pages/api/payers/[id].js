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
			data = await prisma.payer.findUnique({
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
			return res.status(404).json({ errors: ["Payer not found"] });
		}
		return res.status(200).json(data);
	} else if (req.method === "PUT") {
		if (!req.body.name || !req.body.notes) {
			return res
				.status(400)
				.json({ errros: ["Request body not complete"] });
		}

		const prisma = new PrismaClient();
		let data;
		try {
			data = await prisma.payer.update({
				where: {
					id,
				},
				data: {
					name: req.body.name,
					notes: req.body.notes,
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
