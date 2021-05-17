import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useFetch from "../../utils/useFetch";

const ItemsId = () => {
	const router = useRouter();
	const [session, sessionLoading] = useSession();

	const itemNameField = useRef();
	const itemPriceField = useRef();
	const itemAllowAdjustPriceField = useRef();

	const id = router.query.id;
	const { data, error } = useFetch("/api/items/" + id);

	const saveEditHandler = async (event) => {
		event.preventDefault();

		const allowAdjustPrice =
			itemAllowAdjustPriceField.current.value === "Yes" ? true : false;

		const res = await fetch("/api/items/" + id, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: itemNameField.current.value,
				price: Number(itemPriceField.current.value),
				allowAdjustPrice,
			}),
		});
		const data = await res.json();

		if (!data.errors) {
			router.push("/items");
		}
	};

	// Authentication
	if (sessionLoading) return null;
	if (!sessionLoading && !session) {
		router.replace("/login");
	}

	// TODO: Handle Error
	if (error) return <div>failed to load</div>;

	return (
		<div className="pagecontainer">
			<h1 className="text-3xl text-theme-main font-bold">Items</h1>
			<p className="mt-2">
				<span className="font-bold">User: </span>
				{session && session.user.name}
			</p>
			<div className="flex mt-4">
				<Link href="/items">
					<p className="btn mr-2">
						<svg
							className="w-5 h-5 mr-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Back
					</p>
				</Link>
			</div>
			{!data ? (
				<div className="loader"></div>
			) : (
				<form className="flex flex-col mt-6" onSubmit={saveEditHandler}>
					<div className="my-1">
						<label
							className="inline-block w-48 font-bold"
							htmlFor="itemId"
						>
							Item ID
						</label>
						<input
							className="textfield-box w-72 bg-gray-200"
							type="text"
							id="itemId"
							defaultValue={data.id}
							disabled
						/>
					</div>
					<div className="my-1">
						<label
							className="inline-block w-48 font-bold"
							htmlFor="itemName"
						>
							Name
						</label>
						<input
							className="textfield-box w-96"
							type="text"
							id="itemName"
							defaultValue={data.name}
							ref={itemNameField}
						/>
					</div>
					<div className="my-1">
						<label
							className="inline-block w-48 font-bold"
							htmlFor="itemPrice"
						>
							Price
						</label>
						<input
							className="textfield-box w-36"
							type="number"
							id="itemPrice"
							defaultValue={data.price}
							ref={itemPriceField}
						/>
					</div>
					<div className="my-1">
						<label
							className="inline-block w-48 font-bold"
							htmlFor="itemAllowAdjustPrice"
						>
							Allow Price Adjustment
						</label>
						<select
							className="textfield-box w-36"
							id="itemAllowAdjustPrice"
							defaultValue={data.allowAjustPrice ? "Yes" : "No"}
							ref={itemAllowAdjustPriceField}
						>
							<option value="Yes">Yes</option>
							<option value="No">No</option>
						</select>
					</div>

					<div className="my-2">
						<button className="btn" type="submit">
							Save
							<svg
								className="w-5 h-5 ml-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
								/>
							</svg>
						</button>
					</div>
				</form>
			)}
		</div>
	);
};

export default ItemsId;
