const path = require("path");

/**
 * 反例：runtime 混入业务，hash 不稳定。
 */
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
    runtimeChunk: false, // 问题所在
    splitChunks: { chunks: "all" }
  }
};


