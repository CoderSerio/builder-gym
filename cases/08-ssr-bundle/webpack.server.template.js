const path = require("path");

/**
 * TODO：服务端 bundle，target=node，externalize node_modules。
 */
module.exports = {
  mode: "production",
  target: "node",
  entry: path.resolve(__dirname, "src/server/index.ts"),
  output: {
    path: path.resolve(__dirname, "dist/server"),
    filename: "server.js",
    libraryTarget: "commonjs2",
    clean: true
  },
  externals: [
    // TODO: externalize node_modules（如使用 webpack-node-externals）
  ],
  module: {
    rules: [
      { test: /\.[jt]sx?$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  optimization: {
    minimize: false
  }
};


