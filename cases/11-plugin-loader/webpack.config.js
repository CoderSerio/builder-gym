const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { I18nCollectPlugin } = require('./plugins/i18n-collect-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash:8].js',
    clean: true
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          path.resolve(__dirname, 'loaders/strip-debug-block-loader.js'),
          {
            loader: 'swc-loader',
            options: {
              jsc: { parser: { syntax: 'ecmascript' }, target: 'es2019' }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src/index.html') }),
    new I18nCollectPlugin({ impl: 'js', filename: 'i18n.keys.json' }),
    // 仅作为展示：这里不对 __DEBUG__ 做替换，对比由 Loader 剔除注释块
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ terserOptions: { compress: { dead_code: true }, mangle: { reserved: ['t', '__DEBUG__'] } } })]
  }
};
