module.exports = {
  entry: './index.js',
  devtool: 'inline-source-map',
  output: {
    filename: 'public/js/bundle.js',
    publicPath: '',
  },

  module: {
    loaders: [
      {
        test: /\.js|\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
}
