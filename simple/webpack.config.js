const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (webpackEnv, argv) => {
  const isProduction = argv.mode === 'production';
  const buildPath = isProduction
    ? path.resolve(__dirname, './dist/prod')
    : path.resolve(__dirname, './dist/dev');

  return {
    entry: {
      widget: path.resolve(__dirname, './src/widget.jsx'),
    },
    output: {
      path: buildPath,
      filename: '[name].js',
    },
    plugins: [
      new CleanWebpackPlugin(),
      ...(isProduction ? [] : [new webpack.HotModuleReplacementPlugin()]),
      new MiniCssExtractPlugin(),
    ],
    devServer: {
      contentBase: buildPath,
      hot: !isProduction,
      port: 3000,
      writeToDisk: true,
    },
    devtool: 'cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false,
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: 'react-svg-loader',
              options: {
                jsx: true, // true outputs JSX tags
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  };
};