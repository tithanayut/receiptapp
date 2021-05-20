import { PrismaClient, Prisma } from "@prisma/client";
import { getSession } from "next-auth/client";
import { itemsPerPage } from "../../../config";

const handler = async (req, res) => {
	// Authentication
	const session = await getSession({ req });
	if (!session) {
		return res.status(401).json({ errros: ["Unauthorized"] });
	}

	if (req.method === "GET") {
		// Validate page number if exists
		let page;
		if (req.query.page) {
			page = Number(req.query.page);
			if (!Number.isInteger(page)) {
				return res
					.status(400)
					.json({ errors: ["Cannot parse page number"] });
			}
		}

		// Query
		const aggregationQuery = {
			count: {
				id: true,
			},
		};
		const dataQuery = {
			skip: (page - 1) * itemsPerPage,
			take: itemsPerPage,
			orderBy: {
				id: "asc",
			},
		};

		// Set conditions to query if search query submitted
		if (req.query.search) {
			const searchQuery = req.query.search;
			const searchConditions = {
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
			};

			aggregationQuery.where = searchConditions;
			dataQuery.where = searchConditions;
		}

		const prisma = new PrismaClient();
		let data, aggregations;
		let totalRecords, totalPages;
		try {
			aggregations = await prisma.item.aggregate(aggregationQuery);

			totalRecords = aggregations.count.id;
			totalPages = Math.ceil(aggregations.count.id / itemsPerPage);

			// Query page data if page number exists
			if (req.query.page) {
				// Validate page number
				if (page < 1 || page > totalPages) {
					return res
						.status(400)
						.json({ errors: ["Page does not exist"] });
				}

				data = await prisma.item.findMany(dataQuery);
			}
		} catch {
			return res
				.status(500)
				.json({ errors: ["Database connection failed"] });
		} finally {
			await prisma.$disconnect();
		}

		let response = {
			totalRecords,
			dataPerPage: itemsPerPage,
			totalPages,
		};
		// Inject data to response if exist
		if (req.query.page) {
			response.page = page;
			response.data = data;
		}
		return res.status(200).json(response);
	} else if (req.method === "POST") {
		if (
			!req.body.id ||
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
			data = await prisma.item.create({
				data: {
					id: req.body.id,
					name: req.body.name,
					price: req.body.price,
					allowAjustPrice: req.body.allowAdjustPrice,
				},
			});
		} catch (err) {
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				if (err.code === "P2002") {
					return res.status(409).json({
						errors: ["Item with this ID already exists."],
					});
				}
			}
			return res
				.status(500)
				.json({ errors: ["Database connection failed"] });
		} finally {
			await prisma.$disconnect();
		}

		return res.status(201).json({ message: "Created", data });
	}

	return res.status(405).json({ errors: ["Method not supported"] });
};

export default handler;
