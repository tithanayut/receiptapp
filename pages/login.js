import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/client";

const Login = () => {
	const router = useRouter();
	const [session, sessionLoading] = useSession();
	const [errorMessage, setErrorMessage] = useState(null);

	const usernameField = useRef();
	const passwordField = useRef();

	// Redirect if logged in
	if (sessionLoading) return null;
	if (!sessionLoading && session) {
		router.replace("/");
	}

	const loginHandler = async (event) => {
		event.preventDefault();

		const result = await signIn("credentials", {
			redirect: false,
			username: usernameField.current.value,
			password: passwordField.current.value,
		});

		if (!result.error) {
			router.replace("/");
		} else {
			setErrorMessage(result.error);
		}
	};

	return (
		<div className="w-5/6 mt-8 mx-auto">
			{errorMessage && (
				<div className="flex justify-center mt-6">
					<p className="flex justify-center items-center w-1/2 px-4 h-10 bg-red-200 rounded-lg">
						<span className="font-bold mr-2">Error:</span>
						{errorMessage}
					</p>
				</div>
			)}
			<div className="flex justify-center mt-6">
				<form
					className="flex flex-col items-center"
					onSubmit={loginHandler}
				>
					<div className="flex my-1">
						<label className="font-bold" htmlFor="username">
							Username:
						</label>
						<input
							className="w-48 h-8 mx-3 border-b-2 outline-none border-gray-400"
							type="text"
							id="username"
							ref={usernameField}
						/>
					</div>
					<div className="flex my-1">
						<label className="font-bold" htmlFor="password">
							Password:
						</label>
						<input
							className="w-48 h-8 mx-3 border-b-2 outline-none border-gray-400"
							type="password"
							id="password"
							ref={passwordField}
						/>
					</div>
					<div className="mt-6">
						<input
							className="px-6 h-10 bg-theme-main text-theme-opposite font-semibold rounded-md cursor-pointer hover:opacity-90 hover:shadow-sm"
							type="submit"
							value="Login"
						/>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
