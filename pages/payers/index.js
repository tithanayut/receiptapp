import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import Pagination from "../../components/Pagination/Pagination";

const Payers = () => {
	const router = useRouter();
	const [session, sessionLoading] = useSession();
	const [page, setPage] = useState(1);

	const { data: paginationData, error: paginationError } = useSWR(
		"/api/payers",
		fetcher
	);
	const { data: pageData, error: pageError } = useSWR(
		"/api/payers?page=" + page,
		fetcher
	);

	// Authentication
	if (sessionLoading) return null;
	if (!sessionLoading && !session) {
		router.replace("/login");
	}

	// TODO: Handle Error
	if (paginationError || pageError) return <div>failed to load</div>;

	return (
		<div className="pagecontainer">
			<h1 className="text-3xl text-theme-main font-bold">Payers</h1>
			<p className="mt-2">
				<span className="font-bold">User: </span>
				{session && session.user.name}
			</p>
			<div className="flex mt-4">
				<Link href="/">
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
				<Link href="/payers/add">
					<p className="btn">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 mr-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>{" "}
						Add Payer
					</p>
				</Link>
			</div>
			<form className="flex items-center mt-6">
				<label className="font-bold" htmlFor="search">
					Search
				</label>
				<input className="textfield-box w-48" type="text" id="search" />
				<button className="btn" type="submit">
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
				</button>
			</form>
			{!paginationData || !pageData ? (
				<div className="loader"></div>
			) : (
				<>
					<div className="flex justify-center mt-6">
						<table className="w-5/6">
							<thead>
								<tr>
									<th>Payer ID</th>
									<th>Name</th>
									<th>Notes</th>
									<th>Edit</th>
									<th>New Payment</th>
								</tr>
							</thead>
							<tbody>
								{pageData.data.map((payer) => {
									return (
										<tr key={payer.id}>
											<td className="w-1/6 text-center">
												{payer.id}
											</td>
											<td className="w-1/4">
												{payer.name}
											</td>
											<td className="w-1/4 text-center">
												{payer.notes}
											</td>
											<td className="w-1/6 text-center">
												<Link
													href={"/payers/" + payer.id}
												>
													<span className="underline cursor-pointer">
														Edit ({payer.id})
													</span>
												</Link>
											</td>
											<td className="w-1/6 text-center">
												Select ({payer.id})
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
					<div className="mt-6">
						<p className="my-3">
							{paginationData.totalRecords} records in total :{" "}
							{paginationData.totalPages} pages
						</p>
						<Pagination
							totalPages={paginationData.totalPages}
							selectedPage={page}
							setPage={setPage}
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default Payers;
