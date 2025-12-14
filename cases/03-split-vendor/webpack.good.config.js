const path = require("path");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    clean: true
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] }
    ]
  },
  optimization: {
    moduleIds: "deterministic",
    chunkIds: "deterministic",
    runtimeChunk: "single",
    splitChunks: {
      // TODO: 补全这一切！
      chunks: "all",
      cacheGroups: {

      }
    }
  }
};


