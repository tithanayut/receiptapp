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
		<div className="pagecontainer">
			{errorMessage && (
				<div className="flex justify-center mt-6">
					<p className="alert-error w-1/2">
						<span className="font-bold mr-2">Error:</span>
						{errorMessage}
					</p>
				</div>
			)}
			<div className="flex justify-center mt-6">
				<form className="flex flex-col items-center" onSubmit={loginHandler}>
					<div className="flex my-1">
						<label className="font-bold w-20" htmlFor="username">
							Username:
						</label>
						<input
							className="textfield w-48"
							type="text"
							id="username"
							ref={usernameField}
							autoFocus
						/>
					</div>
					<div className="flex my-1">
						<label className="font-bold w-20" htmlFor="password">
							Password:
						</label>
						<input
							className="textfield w-48"
							type="password"
							id="password"
							ref={passwordField}
						/>
					</div>
					<div className="mt-6">
						<input className="btn" type="submit" value="Login" />
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
