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
		const prisma = new PrismaClient();
		let data, aggregations;
		let page, totalRecords, totalPages;
		try {
			aggregations = await prisma.item.aggregate({
				count: {
					id: true,
				},
			});

			totalRecords = aggregations.count.id;
			totalPages = Math.ceil(aggregations.count.id / itemsPerPage);

			// Query page data if page number exists
			if (req.query.page) {
				page = Number(req.query.page);
				// Validate page number
				if (!Number.isInteger(page)) {
					return res
						.status(400)
						.json({ errors: ["Cannot parse page number"] });
				}
				if (page < 1 || page > totalPages) {
					return res
						.status(400)
						.json({ errors: ["Page does not exist"] });
				}

				data = await prisma.item.findMany({
					skip: (page - 1) * itemsPerPage,
					take: itemsPerPage,
					orderBy: {
						id: "asc",
					},
				});
			}

			if (req.query.search) {
				const searchQuery = req.query.search;
				data = await prisma.item.findMany({
					where: {
						OR: [
							{
								id: {
									startsWith: searchQuery,
								},
							},
							{
								name: {
									contains: searchQuery,
								},
							},
						],
					},
					orderBy: {
						id: "asc",
					},
				});
			}
		} catch {
			return res
				.status(500)
				.json({ errors: ["Database connection failed"] });
		} finally {
			await prisma.$disconnect();
		}

		if (req.query.page) {
			return res.status(200).json({
				totalRecords,
				dataPerPage: itemsPerPage,
				totalPages,
				page,
				data,
			});
		}
		if (req.query.search) {
			return res.status(200).json({ data });
		}
		return res.status(200).json({
			totalRecords,
			dataPerPage: itemsPerPage,
			totalPages,
		});
	}

	return res.status(405).json({ errors: ["Method not supported"] });
};

export default handler;
