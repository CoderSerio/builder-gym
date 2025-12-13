const path = require("path");

/**
 * TODO：客户端 bundle，拆 runtime/contenthash，优化缓存。
 */
module.exports = {
  mode: "production",
  target: "web",
  entry: path.resolve(__dirname, "src/client/index.tsx"),
  output: {
    path: path.resolve(__dirname, "dist/client"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    clean: true
  },
  module: {
    rules: [
      { test: /\.[jt]sx?$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: { chunks: "all" }
  }
};


