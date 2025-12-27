const path = require('path');
const { defineConfig } = require('@rspack/cli');
const { HtmlRspackPlugin, DefinePlugin } = require('@rspack/core');
const { I18nCollectPlugin } = require('./plugins/js/i18n-collect-plugin');
const { I18nCollectNativeBridge } = (() => { try { return require('./plugins/js-native-bridge/i18n-collect-plugin.native'); } catch (_) { return {}; } })();

const impl = process.env.PLUGIN_IMPL || 'js'; // js | rust
const stripImpl = process.env.STRIP_IMPL || 'loader'; // loader | define

module.exports = defineConfig({
  mode: 'production',
  entry: { main: path.resolve(__dirname, 'src/index.js') },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    clean: true
  },
  resolve: { extensions: ['.js', '.jsx', '.json'] },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // loader 方案：剔除注释块
        use: [
          stripImpl === 'loader' && path.resolve(__dirname, 'loaders/js/strip-debug-block-loader.js'),
          {
            loader: 'builtin:swc-loader',
            options: { jsc: { parser: { syntax: 'ecmascript' }, target: 'es2019' } }
          }
        ].filter(Boolean)
      }
    ]
  },
  plugins: [
    new HtmlRspackPlugin({ template: path.resolve(__dirname, 'src/index.html') }),
    impl === 'native'
      ? new I18nCollectNativeBridge({ filename: 'i18n.keys.json' })
      : new I18nCollectPlugin({ impl, filename: 'i18n.keys.json' }),
    stripImpl === 'define' && new DefinePlugin({ __DEBUG__: JSON.stringify(false) })
  ].filter(Boolean),
  builtins: {
    // 压缩以便 DefinePlugin 能去掉无用分支，并避免重命名 t/__DEBUG__
    minifyOptions: { compress: { dead_code: true }, mangle: { reserved: ['t', '__DEBUG__'] } }
  }
});
