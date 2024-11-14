// webpack.config.js

const path = require('path');

module.exports = {
  entry: './src/main.js', 
  output: {
    filename: 'scripts.js', 
    path: path.resolve(__dirname, 'dist/js'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  mode: 'development',
};
