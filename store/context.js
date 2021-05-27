import { useState, createContext } from "react";

export const AppContext = createContext({
	payerId: null,
	itemIds: [],
	addItem: () => {},
	setPayer: () => {},
	clear: () => {},
});

const AppContextProvider = (props) => {
	const [payerId, setPayerId] = useState(null);
	const [itemIds, setItemIds] = useState([]);

	const addItem = (itemId, price) => {
		const newItemIds = itemIds.slice();
		newItemIds.push({ id: itemId, price });
		setItemIds(newItemIds);
	};

	const setPayer = (payerId) => {
		setPayerId(payerId);
	};

	const clear = () => {
		setPayerId(null);
		setItemIds([]);
	};

	return (
		<AppContext.Provider value={{ payerId, itemIds, addItem, setPayer, clear }}>
			{props.children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;
