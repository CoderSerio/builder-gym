const path = require("path");

/**
 * 反例：单入口，无 splitChunks，contenthash 缺失。
 * 业务改动会导致整包重下。
 */
module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    clean: true
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] }
    ]
  },
  optimization: {
    splitChunks: false,
    runtimeChunk: false
  }
};


