import { PrismaClient, Prisma } from "@prisma/client";
import jwt from "next-auth/jwt";
import { paymentsPerPage } from "../../../config";

const handler = async (req, res) => {
	// Authentication
	// use JWT instead of session because session doesn't contain appUsername
	const token = await jwt.getToken({ req, secret: process.env.SECRET });
	if (!token) {
		return res.status(401).json({ errros: ["Unauthorized"] });
	}

	if (req.method === "GET") {
		// Validate page number if exists
		let page;
		if (req.query.page) {
			page = Number(req.query.page);
			if (!Number.isInteger(page)) {
				return res.status(400).json({ errors: ["Cannot parse page number"] });
			}
		}

		const prisma = new PrismaClient();
		let data, aggregations;
		let totalRecords, totalPages;
		try {
			aggregations = await prisma.payment.aggregate({
				count: {
					id: true,
				},
			});

			totalRecords = aggregations.count.id;
			totalPages = Math.ceil(aggregations.count.id / paymentsPerPage);

			// Query page data if page number exists
			if (req.query.page) {
				// Validate page number
				if (page < 1 || page > totalPages) {
					return res.status(400).json({ errors: ["Page does not exist"] });
				}

				data = await prisma.payment.findMany({
					skip: (page - 1) * paymentsPerPage,
					take: paymentsPerPage,
					orderBy: {
						id: "asc",
					},
					include: {
						Payer: true,
					},
				});
			}
		} catch {
			return res.status(500).json({ errors: ["Database connection failed"] });
		} finally {
			await prisma.$disconnect();
		}

		let response = {
			totalRecords,
			dataPerPage: paymentsPerPage,
			totalPages,
		};
		// Inject data to response if exist
		if (req.query.page) {
			response.page = page;
			response.data = data;
		}
		return res.status(200).json(response);
	} else if (req.method === "POST") {
		if (!req.body.payerId) {
			return res.status(400).json({ errors: ["Request body not complete"] });
		}
		const prisma = new PrismaClient();
		let data;
		try {
			data = await prisma.payment.create({
				data: {
					Payer: {
						connect: {
							id: req.body.payerId,
						},
					},
					AppUser: {
						connect: {
							username: token.sub,
						},
					},
				},
			});
		} catch (err) {
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				if (err.code === "P2025") {
					return res.status(409).json({
						errors: ["Payer with this ID does not exist."],
					});
				}
			}
			return res.status(500).json({ errors: ["Database connection failed"] });
		} finally {
			await prisma.$disconnect();
		}
		return res.status(201).json({ message: "Created", data });
	}

	return res.status(405).json({ errors: ["Method not supported"] });
};

export default handler;
