const path = require("path");

/**
 * 反例：未显式 sideEffects，含 CJS，摇树不佳。
 * 请根据 README 调整 sideEffects/ESM/optimization 选项。
 */
module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env"] }
        }
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] }
    ]
  },
  // TODO: 开启 optimization.usedExports、sideEffects 优化
  // TODO: 处理 CJS/ESM 混用问题
  devtool: false
};


