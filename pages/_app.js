import Head from "next/head";
import { Provider } from "next-auth/client";
import NextNProgress from "nextjs-progressbar";
import { ToastProvider } from "react-toast-notifications";
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
			<NextNProgress color="#FFBF00" height={4} />
			<ToastProvider placement="top-center">
				<AppContextProvider>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</AppContextProvider>
			</ToastProvider>
		</Provider>
	);
}

export default App;
