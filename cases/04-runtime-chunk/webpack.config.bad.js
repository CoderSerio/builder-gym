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
    // !如果不给一个合适的hash命名，会导致每次构建都会生成新的chunk文件，导致缓存失效
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
    runtimeChunk: false, // !问题之一⚠️
    splitChunks: { chunks: "all" }
  }
};


