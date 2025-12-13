const path = require('path');

/**
 * 00-basic：认识 webpack 四大核心字段
 * 任务：根据 CLI 参数动态切换 development/production 模式
 */
module.exports = (env, argv) => {
  return {
    mode: argv.mode || 'development',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'swc-loader'
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    }
  };
};

