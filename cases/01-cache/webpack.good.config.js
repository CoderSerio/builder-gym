const path = require("path");

/**
 * 正例（good）：
 * - 文件名包含 [contenthash]（内容变 → hash 变 → 文件名变）
 */
module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist/good"),
    // TODO: 修改 filename 配置，使之变得缓存友好
    filename: "bundle.js",
    //这里故意不 clean，让你在本关能看到“多版本产物同时存在”的效果
    clean: false
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
          options: {
            jsc: {
              parser: { syntax: "ecmascript", jsx: true },
              target: "es2019",
              transform: { react: { runtime: "automatic" } }
            }
          }
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};


