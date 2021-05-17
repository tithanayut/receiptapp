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
		const prisma = new PrismaClient();
		let data, aggregations;
		let page, totalRecords, totalPages;
		try {
			aggregations = await prisma.payer.aggregate({
				count: {
					id: true,
				},
			});

			totalRecords = aggregations.count.id;
			totalPages = Math.ceil(aggregations.count.id / payersPerPage);

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

				data = await prisma.payer.findMany({
					skip: (page - 1) * payersPerPage,
					take: payersPerPage,
					orderBy: {
						id: "asc",
					},
				});
			}
<<<<<<< HEAD

			// Query with search params if exists
			if (req.query.search) {
				const searchQuery = req.query.search;
				data = await prisma.payer.findMany({
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
							{
								notes: {
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
=======
>>>>>>> parent of add9845 (Implement search in payer API)
		} catch {
			return res
				.status(500)
				.json({ errors: ["Database connection failed"] });
		} finally {
			await prisma.$disconnect();
		}

		let response = {
			totalRecords,
			dataPerPage: payersPerPage,
			totalPages,
		};
		// Inject data to response if exist
		if (req.query.page) {
			response.page = page;
			response.data = data;
		}
		return res.status(200).json(response);
	}

	return res.status(405).json({ errors: ["Method not supported"] });
};

export default handler;
