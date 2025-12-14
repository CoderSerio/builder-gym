const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/**
 * 反例：Babel + source-map，构建慢。
 */

const isDevServe = process.env.npm_lifecycle_event === "dev:webpack";

module.exports = {
  mode: isDevServe ? "development" : "production",
  entry: path.resolve(__dirname, "src/index.jsx"),
  resolve: {
    // jsx 文件不会被默认解析
    // 同时这里不支持增量配置，一旦设置了这个字段，就需要指定全部需要处理的文件类型
    // 但是，为什么不用设置 css，这是因为 css-loader 会自动处理 css 文件变成 js
    extensions: [".js", ".jsx", ".json"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true
  },
  // TODO: 这里可以根据 isDevServe 来选择
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html")
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] }
    ]
  },
  devServer: {
    // dev-server 会把 HtmlWebpackPlugin 生成的 index.html 与内存中的 bundle 一起提供出来
    static: { directory: path.resolve(__dirname, "dist") },
    host: "localhost",
    port: 5175,
    hot: true,
    open: false,
    onListening(devServer) {
      if (!devServer) return;
      const addr = devServer.server?.address?.();
      const port = typeof addr === "object" && addr ? addr.port : 5175;
      // eslint-disable-next-line no-console
      console.log(`\n\n[🦊 server] running at http://localhost:${port}/ \n\n`);
    }
  }
};


