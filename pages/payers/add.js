import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { useToasts } from "react-toast-notifications";

const PayersAdd = () => {
	const router = useRouter();
	const [session, sessionLoading] = useSession();

	const payerIdField = useRef();
	const payerNameField = useRef();
	const payerNotesField = useRef();

	const { addToast } = useToasts();

	const addPayerHandler = async (event) => {
		event.preventDefault();

		const res = await fetch("/api/payers/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: payerIdField.current.value,
				name: payerNameField.current.value,
				notes: payerNotesField.current.value,
			}),
		});
		const data = await res.json();

		if (data.errors) {
			addToast(data.errors.join(", "), {
				appearance: "error",
				autoDismiss: true,
			});
			return;
		}
		router.push("/payers");
	};

	// Authentication
	if (sessionLoading) return null;
	if (!sessionLoading && !session) {
		router.replace("/login");
	}

	return (
		<div className="pagecontainer">
			<h1 className="text-3xl text-theme-main font-bold">Payers</h1>
			<p className="mt-2">
				<span className="font-bold">User: </span>
				{session && session.user.name}
			</p>
			<div className="flex mt-4">
				<Link href="/payers">
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

			<form className="flex flex-col mt-6" onSubmit={addPayerHandler}>
				<div className="my-1">
					<label className="inline-block w-20 font-bold" htmlFor="payerId">
						Payer ID
					</label>
					<input
						className="textfield-box w-72"
						type="text"
						id="payerId"
						ref={payerIdField}
						required
						autoFocus
					/>
				</div>
				<div className="my-1">
					<label className="inline-block w-20 font-bold" htmlFor="payerName">
						Name
					</label>
					<input
						className="textfield-box w-72"
						type="text"
						id="payerName"
						ref={payerNameField}
						required
					/>
				</div>
				<div className="my-1">
					<label className="inline-block w-20 font-bold" htmlFor="payerNotes">
						Notes
					</label>
					<input
						className="textfield-box w-96"
						type="text"
						id="payerNotes"
						ref={payerNotesField}
					/>
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

export default PayersAdd;
