const path = require("path");

/**
 * 反例：Babel + source-map，构建慢。
 */
module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "src/index.jsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true
  },
  devtool: "source-map",
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
  }
};


