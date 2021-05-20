import { useState, useEffect } from "react";

const useFetch = (url) => {
	const [data, setData] = useState();
	const [error, setError] = useState();

	useEffect(async () => {
		const res = await fetch(url);
		const json = await res.json();

		if (json.errors) {
			setError(json.errors.join(", "));
		} else {
			setData(json);
		}
	}, [url]);

	return { data, error };
};

export default useFetch;
