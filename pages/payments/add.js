import { useRef, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { useToasts } from "react-toast-notifications";
import { AppContext } from "../../store/context";

const PaymentsAdd = () => {
	const router = useRouter();
	const [session, sessionLoading] = useSession();

	const context = useContext(AppContext);

	const payerIdField = useRef();
	const itemIdField = useRef();

	const { addToast } = useToasts();

	// Authentication
	if (sessionLoading) return null;
	if (!sessionLoading && !session) {
		router.replace("/login");
	}

	const setPayerHandler = async (event) => {
		event.preventDefault();

		// Skip to next field if payer already set
		if (context.payer && payerIdField.current.value === "") {
			itemIdField.current.focus();
			return;
		}

		const result = await context.setPayer(payerIdField.current.value);
		if (!result.result) {
			addToast(result.errors.join(", "), {
				appearance: "error",
				autoDismiss: true,
			});
			return;
		}

		itemIdField.current.focus();
	};

	const addItemHandler = async (event) => {
		event.preventDefault();
		const result = await context.addItem(itemIdField.current.value);

		if (!result.result) {
			addToast(result.errors.join(", "), {
				appearance: "error",
				autoDismiss: true,
			});
			return;
		}

		itemIdField.current.value = "";
		itemIdField.current.focus();
	};

	const clearFormHandler = () => {
		context.clear();
		payerIdField.current.value = "";
		itemIdField.current.value = "";
		payerIdField.current.focus();
	};

	const createPaymentHandler = async () => {
		const result = await context.createPayment();

		if (!result.result) {
			addToast(result.errors.join(", "), {
				appearance: "error",
				autoDismiss: true,
			});
			return;
		}

		addToast("Payment Recorded", {
			appearance: "success",
			autoDismiss: true,
		});

		window.open(
			`/html/receipt/receipt.html?id=${encodeURIComponent(
				result.paymentId
			)}&action=print`
		);
		clearFormHandler();
	};

	return (
		<div className="pagecontainer">
			<h1 className="text-3xl text-theme-main font-bold">Payments</h1>
			<p className="mt-2">
				<span className="font-bold">User: </span>
				{session && session.user.name}
			</p>
			<div className="flex mt-4">
				<Link href="/payments">
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
				<p className="btn-no-bg bg-red-600" onClick={clearFormHandler}>
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
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					Clear
				</p>
			</div>
			<hr className="my-8 border-gray-600" />
			<div className="mt-8">
				<form className="flex items-center" onSubmit={setPayerHandler}>
					<label className="w-20 font-bold" htmlFor="payerId">
						Payer ID:
					</label>
					<input
						className="textfield-box w-48"
						type="text"
						id="payerId"
						ref={payerIdField}
						autoFocus
					/>
					<div className="mr-2">
						<button className="btn" type="submit">
							Confirm
						</button>
					</div>
					<Link href="/payers">
						<div className="btn">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"
								/>
							</svg>
						</div>
					</Link>
				</form>
				<div className="flex font-bold mt-4">
					<p className="w-20">Payer:</p>
					<p className="text-lg">
						{context.payer ? (
							`${context.payer.id} — ${context.payer.name} — [${context.payer.notes}]`
						) : (
							<span className="text-red-600">...</span>
						)}
					</p>
				</div>
			</div>
			<hr className="my-8 border-gray-600" />
			<div className="mt-8">
				<form className="flex items-center" onSubmit={addItemHandler}>
					<label className="w-20 font-bold" htmlFor="itemId">
						Item ID:
					</label>
					<input
						className="textfield-box w-48"
						type="text"
						id="itemId"
						ref={itemIdField}
					/>
					<div className="mr-2">
						<button className="btn" type="submit">
							Add
						</button>
					</div>
					<Link href="/items">
						<div className="btn">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"
								/>
							</svg>
						</div>
					</Link>
				</form>
			</div>
			<div className="flex justify-center mt-4">
				{context.items.length > 0 && (
					<table className="w-2/3">
						<thead>
							<tr>
								<th className="w-1/12">#</th>
								<th className="w-1/6">Item ID</th>
								<th className="w-5/12">Name</th>
								<th className="w-1/6">Price</th>
								<th className="w-1/6">Delete</th>
							</tr>
						</thead>
						<tbody>
							{context.items.map((item, index) => {
								return (
									<tr key={index}>
										<td className="text-center">{index + 1}</td>
										<td className="text-center">{item.id}</td>
										<td>{item.name}</td>
										<td className="text-center">
											{item.allowAdjustPrice ? (
												<input
													className="textfield-box text-center w-2/3"
													type="number"
													min="0"
													step=".01"
													defaultValue={item.price}
													onChange={(event) => {
														context.setItemPrice(index, event.target.value);
													}}
												/>
											) : (
												item.price
											)}
										</td>
										<td className="text-center">
											<svg
												className="w-6 h-6 inline cursor-pointer text-red-600"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
												onClick={() => {
													context.removeItem(index);
												}}
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>
			<hr className="my-8 border-gray-600" />
			<div className="flex">
				<span className="w-20"></span>
				<p className="btn w-64" onClick={createPaymentHandler}>
					Create Payment
					<svg
						className="w-5 h-5 ml-1"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</p>
			</div>
		</div>
	);
};

export default PaymentsAdd;
