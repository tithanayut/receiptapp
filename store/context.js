import { useState, createContext } from "react";

export const AppContext = createContext({
	payer: null,
	items: [],
	addItem: () => {},
	setPayer: () => {},
	clear: () => {},
});

const AppContextProvider = (props) => {
	const [payerInfo, setPayerInfo] = useState(null);
	const [items, setItems] = useState([]);

	const addItem = (itemId, price) => {
		const newItems = items.slice();
		newItems.push({ id: itemId, price });
		setItems(newItems);
	};

	const setPayer = async (payerId) => {
		const res = await fetch("/api/payers/" + encodeURIComponent(payerId));
		const data = await res.json();

		if (data.errors || !data.id) {
			setPayerInfo(null);
			return false;
		}
		setPayerInfo(data);
		return true;
	};

	const clear = () => {
		setPayerInfo(null);
		setItems([]);
	};

	return (
		<AppContext.Provider
			value={{ payer: payerInfo, items, addItem, setPayer, clear }}
		>
			{props.children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;
