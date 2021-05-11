import Head from "next/head";
import Layout from "../components/Layout/Layout";
import "../styles/globals.css";

function App({ Component, pageProps }) {
	return (
		<Layout>
			<Head>
				<title>Receiptapp</title>
				<link rel="icon" href="/favicon.svg" />
			</Head>

			<Component {...pageProps} />
		</Layout>
	);
}

export default App;
