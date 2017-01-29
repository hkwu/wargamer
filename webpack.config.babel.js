import fs from 'fs';
import merge from 'webpack-merge';
import path from 'path';
import webpack from 'webpack';

const common = {
  entry: './src/index.js',
  output: {
    library: 'Wargamer',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [
            ['env', {
              targets: {
                browsers: [
                  '> 2%',
                ],
              },
            }],
          ],
          plugins: [
            'transform-class-properties',
          ],
        },
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

const development = {
  output: {
    filename: 'wargamer.js',
  },
};

const production = {
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
      return merge(common, production);
    default:
      return merge(common, development);
  }
};
