import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useFetch from "../../../utils/useFetch";

const PayersId = () => {
	const router = useRouter();
	const [session, sessionLoading] = useSession();

	const payerNameField = useRef();
	const payerNotesField = useRef();

	const id = router.query.id;
	const { data, error } = useFetch("/api/payers/" + id);

	const saveEditHandler = async (event) => {
		event.preventDefault();

		const res = await fetch("/api/payers/" + id, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: payerNameField.current.value,
				notes: payerNotesField.current.value,
			}),
		});
		const data = await res.json();

		if (!data.errors) {
			router.push("/payers");
		}
		// TODO: Handle Error
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
			{!data ? (
				<div className="loader"></div>
			) : (
				<form className="flex flex-col mt-6" onSubmit={saveEditHandler}>
					<div className="my-1">
						<label
							className="inline-block w-20 font-bold"
							htmlFor="payerId"
						>
							Payer ID
						</label>
						<input
							className="textfield-box w-72 bg-gray-200"
							type="text"
							id="payerId"
							defaultValue={data.id}
							disabled
						/>
					</div>
					<div className="my-1">
						<label
							className="inline-block w-20 font-bold"
							htmlFor="payerName"
						>
							Name
						</label>
						<input
							className="textfield-box w-72"
							type="text"
							id="payerName"
							defaultValue={data.name}
							ref={payerNameField}
						/>
					</div>
					<div className="my-1">
						<label
							className="inline-block w-20 font-bold"
							htmlFor="payerNotes"
						>
							Notes
						</label>
						<input
							className="textfield-box w-96"
							type="text"
							id="payerNotes"
							defaultValue={data.notes}
							ref={payerNotesField}
						/>
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

export default PayersId;
