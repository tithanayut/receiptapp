module.exports = {
	purge: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				theme: {
					main: "#1E40AF",
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
