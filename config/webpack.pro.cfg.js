const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const APP_PATH = path.join(__dirname, '..');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = {
  mode: "production",
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'xtn-[name].[hash:8].js',               //    chunkhash 
    chunkFilename: 'xtn-[name].[hash:8].js',
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, exclude: /(node_modules|bower_components)/, use: { loader: 'babel-loader', } },
      { test: /\.ejs$/, use: ['ejs-webpack-loader'] },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/i,
        use: [{ loader: 'url-loader', options: { limit: 4096, name: 'images/[hash:8].[name].[ext]' } }]
      },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, { loader: "css-loader" },] },
      {
        test: /\.scss$/, use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { sourceMap: true, modules: { localIdentName: '[name]_[local]_[hash:base64:5]', }, } },
          { loader: 'postcss-loader', options: { sourceMap: true, config: { path: 'postcss.config.js' }, } },
          { loader: "sass-loader" }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: { chunks: 'initial', minChunks: 2, maxInitialRequests: 5, minSize: 0 },
        vendor: { test: /node_modules/, chunks: 'initial', name: 'vendor', priority: 10, enforce: true }
      }
    },
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    }
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ chunksSortMode: 'none', template: '!!ejs-webpack-loader!./src/index.ejs', filename: 'index.html' }),
    new MiniCssExtractPlugin({
      filename: "[name].[hash:8].css",
      chunkFilename: '[id].[hash:8].css'
    }),

  ],
}