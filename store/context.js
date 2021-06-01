import { useState, createContext } from "react";

export const AppContext = createContext({
	payer: null,
	items: [],
	setPayer: async () => {},
	addItem: async () => {},
	setItemPrice: () => {},
	createPayment: async () => {},
	clear: () => {},
});

const AppContextProvider = (props) => {
	const [payerInfo, setPayerInfo] = useState(null);
	const [items, setItems] = useState([]);

	const setPayer = async (payerId) => {
		const res = await fetch("/api/payers/" + encodeURIComponent(payerId));
		const data = await res.json();

		if (data.errors || !data.id) {
			setPayerInfo(null);
			return {
				result: false,
				errors: data.errors || ["Unable to set this Payer ID"],
			};
		}
		setPayerInfo(data);
		return { result: true };
	};

	const addItem = async (itemId) => {
		const res = await fetch("/api/items/" + encodeURIComponent(itemId));
		const data = await res.json();

		if (data.errors || !data.id) {
			return {
				result: false,
				errors: data.errors || ["Unable to add this item"],
			};
		}

		const updatedItems = items.slice();
		updatedItems.push({
			id: data.id,
			name: data.name,
			price: data.price,
			allowAdjustPrice: data.allowAjustPrice,
		});
		setItems(updatedItems);
		return { result: true };
	};

	const setItemPrice = (itemIndex, price) => {
		let result = { result: false, errors: ["Cannot update item price."] };

		const updatedItems = items.map((item, index) => {
			if (index === itemIndex) {
				if (item.allowAdjustPrice) {
					result.result = true;
					return {
						...item,
						price: parseFloat(price),
					};
				}
			} else {
				return item;
			}
		});
		setItems(updatedItems);

		return result;
	};

	const createPayment = async () => {
		if (!payerInfo || items.length === 0) {
			return {
				result: false,
				errors: ["Form not completed. Please add both payer and item data."],
			};
		}

		const res = await fetch("/api/payments", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ payerId: payerInfo.id, items }),
		});
		const data = await res.json();

		if (data.errors) {
			return { result: false, errors: data.errors };
		} else {
			clear();
			return { result: true };
		}
	};

	const clear = () => {
		setPayerInfo(null);
		setItems([]);
	};

	return (
		<AppContext.Provider
			value={{
				payer: payerInfo,
				items,
				setPayer,
				addItem,
				setItemPrice,
				createPayment,
				clear,
			}}
		>
			{props.children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;
