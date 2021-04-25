const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack'); // 用于访问内置插件
const CoptPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  module: {
    rules: [
      { test: /\.vue$/, use: 'vue-loader' },
      { test: /\.css$/, use: ['vue-style-loader', 'css-loader']},
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new CoptPlugin({
      patterns: [
        {from: 'src/*.html', to: '[name].[ext]'}
      ]
    })
  ],
  mode: 'development',
};
