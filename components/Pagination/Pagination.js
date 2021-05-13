const Pagination = (props) => {
	const pageSelectors = [];

	for (let i = 0; i < props.totalPages; i++) {
		const pageSelectorClass = ["mx-1 cursor-pointer"];
		if (props.selectedPage === i + 1) {
			pageSelectorClass.push("text-theme-main", "font-bold");
		}

		pageSelectors.push(
			<li
				key={i}
				className={pageSelectorClass.join(" ")}
				onClick={() => {
					props.setPage(i + 1);
				}}
			>
				{i + 1}
			</li>
		);
	}

	return (
		<ul className="flex flex-wrap select-none">
			{props.selectedPage !== 1 && (
				<li
					className="mx-1 cursor-pointer"
					onClick={() => {
						props.setPage(props.selectedPage - 1);
					}}
				>
					&lt; Previous
				</li>
			)}
			{pageSelectors}
			{props.selectedPage !== props.totalPages && (
				<li
					className="mx-1 cursor-pointer"
					onClick={() => {
						props.setPage(props.selectedPage + 1);
					}}
				>
					Next &gt;
				</li>
			)}
		</ul>
	);
};

export default Pagination;
