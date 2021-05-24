import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";

const handler = async (req, res) => {
	// Authentication
	const session = await getSession({ req });
	if (!session) {
		return res.status(401).json({ errros: ["Unauthorized"] });
	}

	// Parse and validate payment ID
	const id = Number(req.query.id);
	if (!Number.isInteger(id)) {
		return res.status(400).json({ errors: ["Cannot parse payment ID"] });
	}

	if (req.method === "GET") {
		const prisma = new PrismaClient();
		let data;
		try {
			data = await prisma.payment.findUnique({
				where: {
					id,
				},
				include: {
					Payer: true,
					AppUser: {
						select: {
							username: true,
							displayname: true,
						},
					},
				},
			});
		} catch {
			return res.status(500).json({ errors: ["Database connection failed"] });
		} finally {
			await prisma.$disconnect();
		}

		if (!data) {
			return res.status(404).json({ errors: ["Payment not found"] });
		}
		return res.status(200).json(data);
	}

	return res.status(405).json({ errors: ["Method not supported"] });
};

export default handler;
