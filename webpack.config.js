const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = {
  // context: path.resolve(__dirname),
  entry: ['@babel/polyfill', './app.js'],
  watch: true,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: 'public/js/',
    chunkFilename: '[id].main.js'
  },
  context: __dirname,
  node: {
    __filename: true,
    __dirname: true
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.hbs$/,
        use: {
          loader: '@icetee/handlebars-loader',
          options: {
            query: {
              partialsDir: [
                path.resolve(__dirname, 'views'),
                path.resolve(__dirname, 'views', 'partials'),
                path.resolve(__dirname, 'views', 'account'),
                path.resolve(__dirname, 'views', 'travels'),
                path.resolve(__dirname, 'views', 'expenses')
              ]
            }
          }
        }
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'restyle-loader'
          },
          {
            loader: 'file-loader',
            options: {
              name: '[name].css?[hash:8]'
            }
          }
        ]
      }
    ]
  },
  mode: 'development',
  resolve: {
    extensions: ['.js', '.css', '.hbs']
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new NodemonPlugin({
      // Arguments to pass to the script being watched.
      // args: ['demo'],

      // What to watch.
      watch: path.resolve('./build'),

      // Files to ignore.
      ignore: ['*.js.map'],

      // Detailed log.
      verbose: true,

      // Node arguments.
      // nodeArgs: ['--inspect'],

      // If using more than one entry, you can specify
      // which output file will be restarted.
      script: './build/main.js',

      // Extensions to watch
      ext: 'js,njk,json'
    })
  ]
};
