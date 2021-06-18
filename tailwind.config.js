module.exports = {
	purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				theme: {
					main: "#0078d4",
					opposite: "#FFF",
				},
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
