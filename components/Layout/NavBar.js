import Link from "next/link";

const NavBar = () => {
	return (
		<nav>
			<div>
				<Link href="/">
					<a>Receiptapp</a>
				</Link>
			</div>
			<ul>
				<li>
					<Link href="/payments">
						<a>Payments</a>
					</Link>
				</li>
				<li>
					<Link href="/payers">
						<a>Payers</a>
					</Link>
				</li>
				<li>
					<Link href="/items">
						<a>Items</a>
					</Link>
				</li>
			</ul>
			<ul>
				<li>
					<Link href="/login">
						<a>Login</a>
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default NavBar;
