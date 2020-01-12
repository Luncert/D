const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let common_config = {
  node: {
    __dirname: true
  },
  mode: process.env.ENV || 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [
          /node_modules/,
           path.resolve(__dirname, "src/ui")
        ]
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader'},
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.(ttf|otf)$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.css' ]
  },
};

let main_config = Object.assign({}, common_config, {
  target: 'electron-main',
  entry: {
    main: './src/main/index.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
});

let renderer_config = Object.assign({}, common_config, {
  target: 'electron-renderer',
  entry: {
    renderer: './src/renderer/index.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: './public',
      to: path.resolve(__dirname, 'dist')
    }])
  ]
});

module.exports = [
  main_config,
  renderer_config
];