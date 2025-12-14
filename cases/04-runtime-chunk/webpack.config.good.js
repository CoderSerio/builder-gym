const path = require("path");

/**
 * TODO：抽离 runtime，保持 hash 稳定。
 */
module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    // TODO: 修改这里
    chunkFilename: "[name].js",
    clean: true
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] }
    ]
  },
  optimization: {
    // TODO: 修改这里
    runtimeChunk: false,
    splitChunks: {
      chunks: "all"
    }
  }
};


