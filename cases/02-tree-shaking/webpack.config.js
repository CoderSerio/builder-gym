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
          // 如果愿意用 swc-loader 的话也可以替换这里
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env"] }
        }
      },
      // TODO: 处理 CSS 的问题
    ]
  },
  // TODO: 开启优化
  optimization: {
    // 是否标记未使用的导出（开启有利于更精准的tree shaking）
    usedExports: false,
    // 模块合并, 开启后可以减少模块数量，减小体积
    concatenateModules: false,
    // 是否删除未使用的模块
    sideEffects: false,
  },
  devtool: false
};


