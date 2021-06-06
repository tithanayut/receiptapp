import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import Pagination from "../../components/Pagination/Pagination";
import { paymentIdPrefix } from "../../config";

const Payments = () => {
	const router = useRouter();
	const [session, sessionLoading] = useSession();
	const [page, setPage] = useState(1);

	const paginationURL = "/api/payments";
	const dataURL = `/api/payments?page=${page.toString()}`;

	const { data: paginationData, error: paginationError } = useSWR(
		paginationURL,
		fetcher
	);
	const { data: pageData, error: pageError } = useSWR(dataURL, fetcher);

	// Authentication
	if (sessionLoading) return null;
	if (!sessionLoading && !session) {
		router.replace("/login");
	}

	// TODO: Handle Error
	if (paginationError || pageError) return <div>failed to load</div>;

	return (
		<div className="pagecontainer">
			<h1 className="text-3xl text-theme-main font-bold">Payments</h1>
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
				<Link href="/payments/add">
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
						Create New Payment
					</p>
				</Link>
			</div>
			{!paginationData || !pageData ? (
				<div className="loader"></div>
			) : pageData.data ? (
				<>
					<div className="flex justify-center mt-6">
						<table className="w-5/6">
							<thead>
								<tr>
									<th>ID</th>
									<th>Date</th>
									<th>Payer</th>
									<th>Created By</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{pageData.data.map((payment) => {
									const paymentDate = new Date(payment.date);
									return (
										<tr key={payment.id}>
											<td className="w-1/6 text-center">
												{paymentIdPrefix}
												{payment.id}
											</td>
											<td className="w-1/6 text-center">
												{paymentDate.getDate()}/{paymentDate.getMonth() + 1}/
												{paymentDate.getFullYear()}
											</td>
											<td className="w-1/4 ">
												{payment.Payer.id} - {payment.Payer.name}
											</td>
											<td className="w-1/6">
												{payment.AppUser.displayname} (
												{payment.AppUser.username})
											</td>
											<td className="w-1/4 text-center">
												{payment.isactive ? "Completed" : "Cancelled"}
												<a
													href={`/html/receipt/receipt.html?id=${encodeURIComponent(
														payment.id
													)}`}
													rel="noopener noreferrer"
													target="_blank"
												>
													<svg
														className="inline text-theme-main w-6 h-6 ml-2 cursor-pointer"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
														/>
													</svg>
												</a>
												<a
													href={`/html/receipt/receipt.html?id=${encodeURIComponent(
														payment.id
													)}&action=print`}
													rel="noopener noreferrer"
													target="_blank"
												>
													<svg
														className="inline text-theme-main w-6 h-6 ml-2 cursor-pointer"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 
                                                            0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 
                                                            2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 
                                                            2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
														/>
													</svg>
												</a>
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
			) : (
				<div className="flex justify-center mt-6">
					<p className="alert-error w-1/2">
						<span className="font-bold mr-2">No record found</span>
					</p>
				</div>
			)}
		</div>
	);
};

export default Payments;
