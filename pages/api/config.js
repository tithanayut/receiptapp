import { receiptConfig, paymentIdPrefix } from "../../config";

const handler = async (req, res) => {
	return res.status(200).json({ receiptConfig, paymentIdPrefix });
};

export default handler;
