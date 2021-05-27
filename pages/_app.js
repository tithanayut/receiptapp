import Head from "next/head";
import { Provider } from "next-auth/client";
import AppContextProvider from "../store/context";
import Layout from "../components/Layout/Layout";
import "../styles/globals.css";

function App({ Component, pageProps }) {
	return (
		<Provider session={pageProps.session}>
			<Head>
				<title>Receiptapp</title>
				<link rel="icon" href="/favicon.svg" />
			</Head>
			<AppContextProvider>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</AppContextProvider>
		</Provider>
	);
}

export default App;
