import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

const ItemsAdd = () => {
	const router = useRouter();
	const [session, sessionLoading] = useSession();

	const itemIdField = useRef();
	const itemNameField = useRef();
	const itemPriceField = useRef();
	const itemAllowAdjustPriceField = useRef();

	const addItemHandler = async (event) => {
		event.preventDefault();

		const allowAdjustPrice =
			itemAllowAdjustPriceField.current.value === "Yes" ? true : false;

		const res = await fetch("/api/items/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: itemIdField.current.value,
				name: itemNameField.current.value,
				price: Number(itemPriceField.current.value),
				allowAdjustPrice,
			}),
		});
		const data = await res.json();

		if (!data.errors) {
			router.push("/items");
		}
		// TODO: Handle Error
	};

	// Authentication
	if (sessionLoading) return null;
	if (!sessionLoading && !session) {
		router.replace("/login");
	}

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

			<form className="flex flex-col mt-6" onSubmit={addItemHandler}>
				<div className="my-1">
					<label
						className="inline-block w-48 font-bold"
						htmlFor="itemId"
					>
						Item ID
					</label>
					<input
						className="textfield-box w-72"
						type="text"
						id="itemId"
						ref={itemIdField}
						required
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
						ref={itemNameField}
						required
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
						min="0"
						step=".01"
						ref={itemPriceField}
						required
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
						ref={itemAllowAdjustPriceField}
						defaultValue="No"
					>
						<option value="Yes">Yes</option>
						<option value="No">No</option>
					</select>
				</div>

				<div className="my-2">
					<button className="btn" type="submit">
						Add
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
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
					</button>
				</div>
			</form>
		</div>
	);
};

export default ItemsAdd;
