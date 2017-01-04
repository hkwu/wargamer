const fs = require('fs');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const common = {
  entry: './src/index.js',
  output: {
    library: 'wargamer',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin(fs.readFileSync('./LICENSE', 'utf8').trim()),
  ],
  devtool: 'source-map',
};

const dev = {
  output: {
    filename: 'wargamer.js',
  },
};

const prod = {
  output: {
    filename: 'wargamer.min.js',
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
  ],
};

module.exports = (env) => {
  const { target } = env;

  switch (target) {
    case 'prod':
    case 'production':
      return merge(common, prod);
    default:
      return merge(common, dev);
  }
};
