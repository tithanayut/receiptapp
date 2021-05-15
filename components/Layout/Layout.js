import NavBar from "./NavBar";

const Layout = (props) => {
	return (
		<>
			<header>
				<NavBar />
			</header>
			<main className="text-gray-800">{props.children}</main>
		</>
	);
};

export default Layout;
