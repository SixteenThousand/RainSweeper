const path = require("path");

module.exports = {
	entry: "./src/Sweeper-main.js",
	output: {
		filename: "Sweeper.js",
		path: path.resolve(__dirname,"../dist"),
	}
}
