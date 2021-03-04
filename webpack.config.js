var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  // const API_REST_SOURCE = 'http://localhost:8000'
  const API_REST_SOURCE = 'http://localhost/ppcf/ppcf-rest/public';
  const API_REST_URL = !argv.mode || argv.mode === 'production' ? API_REST_SOURCE : 'http://localhost:3000';
  const basename = !argv.mode ? __dirname.replace('/var/www', '') + '/dist' : ''; // The root of Apache must be /var/www

  return {
    entry: {
      main: path.join(__dirname, 'src/index.js'),
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: `${basename}/`,
      filename: '[hash].js',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
            },
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.s(a|c)ss$/,
          exclude: /\.module.(s(a|c)ss)$/,
          loader: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      ...(!argv.mode || argv.mode === 'production' ? [new CleanWebpackPlugin()] : []),
      new HtmlWebpackPlugin({ template: './public/index.html' }),
      // new BaseHrefWebpackPlugin({ baseHref: basename }),
      new webpack.DefinePlugin({
        process: {
          env: {
            BASENAME: JSON.stringify(basename),
            API_REST_URL: JSON.stringify(API_REST_URL),
          },
        },
      }),
      new CopyPlugin([
        {
          from: 'src/*.json',
          flatten: true,
        },
        {
          from: 'src/*.ico',
          flatten: true,
        },
        {
          from: 'public/htaccess', // It requires AllowOverride All for that directory in Apache config (apache2.conf)
          to: '.htaccess',
          toType: 'template',
        },
      ]),
      new MiniCssExtractPlugin({
        filename: '[hash].css',
        chunkFilename: '[hash].css',
      }),
    ],
    devServer: {
      host: 'localhost',
      port: 3000,
      historyApiFallback: true,
      proxy: {
        '/rest/**': {
          target: API_REST_SOURCE,
        },
      },
    },
    resolve: {
      extensions: ['.js'],
      // eslint-disable-next-line node/no-path-concat
      modules: ['src', 'node_modules'],
    },
    /* optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({  // This plugin makes slow the process of WebPack compilation / recompilation.
          cache: false,
          terserOptions: {
            // No rename components names
            keep_classnames: true,
            keep_fnames: true,
          },
        }),
      ],
    }, */
  };
};
