const path = require("path");

/**
 * TODO: 按 Framework/Libs/Commons/App 分层拆分，并保持 contenthash 稳定。
 * 提示：使用 splitChunks.cacheGroups + runtimeChunk: 'single'。
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
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        // TODO: framework/lib/commons/app 分层
      }
    },
    runtimeChunk: {
      name: "runtime"
    }
  }
};


