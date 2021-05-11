import Link from "next/link";

const NavBar = () => {
	return (
		<nav>
			<div className="flex justify-between items-center px-5 py-3 bg-theme-main text-theme-opposite">
				<div className="flex items-center">
					<Link href="/">
						<a className="text-xl font-bold mr-6">Receiptapp</a>
					</Link>
					<ul className="flex">
						<li className="mr-4">
							<Link href="/payments">
								<a>Payments</a>
							</Link>
						</li>
						<li className="mr-4">
							<Link href="/payers">
								<a>Payers</a>
							</Link>
						</li>
						<li className="mr-4">
							<Link href="/items">
								<a>Items</a>
							</Link>
						</li>
					</ul>
				</div>
				<ul className="flex">
					<li>
						<Link href="/login">
							<a>Logout</a>
						</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default NavBar;
