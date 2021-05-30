import { getSession } from "next-auth/client";
import { receiptConfig, paymentIdPrefix } from "../../config";

const handler = async (req, res) => {
	// Authentication
	const session = await getSession({ req });
	if (!session) {
		return res.status(401).json({ errros: ["Unauthorized"] });
	}

	return res.status(200).json({ receiptConfig, paymentIdPrefix });
};

export default handler;
