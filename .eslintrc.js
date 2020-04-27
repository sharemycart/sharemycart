module.exports = {
	"parser": "babel-eslint",
	"env": {
		"browser": true,
		"es6": true
	},
	"extends": [
		"react-app",
		"plugin:react/recommended",
		"plugin:cypress/recommended",
		"plugin:chai-friendly/recommended",
	],
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true
		},
		"ecmaVersion": 2018,
		"sourceType": "module"
	},
	"plugins": [
		"react"
	],
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"never"
		],
		"react/prop-types": 0, // we'll be moving to Typescript some time to make interfaces type-safe
		"react/display-name": 1,
		"chai-friendly/no-unused-expressions": 1,
		"no-console": 1
	}
};