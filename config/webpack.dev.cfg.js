const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const APP_PATH = path.join(__dirname, '..');

const devTools = [
  'source-map',
  'hidden-source-map',
  'inline-source-map',
  'eval-source-map',
  'cheap-source-map',
  'cheap-module-source-map',
  'cheap-module-eval-source-map'
];

module.exports = {
  mode: "development",
  devtool: devTools[0],
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'babel-loader', }
      },
      { test: /\.ejs$/, use: ['ejs-webpack-loader'] },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/i,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 4096,
            name: 'images/[hash:8].[name].[ext]'
          }
        }]
      },
      { test: /\.css$/, use: [{ loader: "style-loader" }, { loader: "css-loader" },] },
      {
        test: /\.scss$/, use: [
          { loader: "style-loader" },
          { loader: "css-loader", options: { sourceMap: true, modules: { localIdentName: '[name]_[local]_[hash:base64:5]', }, } },
          { loader: 'postcss-loader', options: { sourceMap: true, config: { path: 'postcss.config.js' }, } },
          { loader: "sass-loader" }
        ]
      }
    ]
  },

  devServer: {
    historyApiFallback: true,
    host: 'localhost', // '0.0.0.0',  // 
    port: process.env.PORT || 2105,
    proxy: {
      '/uploads/attachment': {
        target: 'http://127.0.0.1:4100/api/attachment/detail', // 接口的域名
        pathRewrite: { '^/uploads/attachment': '' },
        secure: false,
        changeOrigin: false,
      }
    }
  },

  plugins: [
    new HtmlWebpackPlugin({ chunksSortMode: 'none', template: '!!ejs-webpack-loader!./src/index.ejs', filename: 'index.html' }),
  ],
}