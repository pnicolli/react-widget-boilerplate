const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (webpackEnv, argv) => {
  // Used to separate development and production build logic.
  // This is set by the --mode flag we pass to webpack in the build scripts
  // (see the scripts in package.json)
  const isProduction = argv.mode === 'production';
  // Separate folders for development and production. In most of my sites it is useful
  // for me to keep the latest production build committed in the git repo
  // while the dev build is git-ignored because it changes on every file save.
  const buildPath = isProduction
    ? path.resolve(__dirname, './dist/prod')
    : path.resolve(__dirname, './dist/dev');

  return {
    // Here you define entrypoint for each separate component or widget
    // you want to build and use separately on your site.
    entry: {
      widget: path.resolve(__dirname, './src/widget.jsx'),
    },
    // Path that will contain a file for each entrypoint specified above.
    // The default name for the output files is [name].js, which means for example
    // that for our "widget" entrypoint above, a widget.js output file will be generated.
    output: {
      path: buildPath,
    },
    plugins: [
      // Empties the output folder before every build
      new CleanWebpackPlugin(),
      // Enable hot module replacement in development only
      ...(isProduction ? [] : [new webpack.HotModuleReplacementPlugin()]),
      // Extract css in a dedicated css file
      new MiniCssExtractPlugin(),
    ],
    // This tells webpack to also write built files on disk when in development mode,
    // which is not default behaviour, since it serves them from memory.
    devServer: {
      devMiddleware: {
        writeToDisk: true,
      },
      hot: !isProduction,
      port: 3000,
      static: [buildPath],
    },
    // Set the type of sourcemap that is generated based on webpack mode
    devtool: isProduction ? 'source-map' : 'eval',
    // Instruct webpack about how to handle the different type of files
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
    // Instruct webpack about libraries to exclude from the final bundle it builds
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  };
};
