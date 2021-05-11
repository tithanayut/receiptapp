import Link from "next/link";
import { useSession, signOut } from "next-auth/client";

const NavBar = () => {
	const [session] = useSession();

	return (
		<nav>
			<div className="flex justify-between items-center px-5 py-3 bg-theme-main text-theme-opposite">
				<div className="flex items-center">
					<Link href="/">
						<a className="text-xl font-bold mr-6">Receiptapp</a>
					</Link>
					{session && (
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
					)}
				</div>
				<ul className="flex">
					{!session && (
						<li>
							<Link href="/login">
								<a>Login</a>
							</Link>
						</li>
					)}
					{session && (
						<li>
							<p
								className="cursor-pointer"
								onClick={() =>
									signOut({
										redirect: false,
										callbackUrl: "/",
									})
								}
							>
								Logout
							</p>
						</li>
					)}
				</ul>
			</div>
		</nav>
	);
};

export default NavBar;
