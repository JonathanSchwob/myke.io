var webpack = require('webpack');
var path = require('path');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, './app/dist/');
var APP_DIR = path.resolve(__dirname, './app/src/');

var config = {
  entry: APP_DIR + '/Routes.jsx',
  output: {
    path: BUILD_DIR,
    filename: '/bundle.js'

  },
  devtool: 'source-map',  
  module:{
    loaders:[
      {
        test : /\.jsx?/,
        include: APP_DIR,
        loader : 'babel-loader'
      },
      {
        test : /\.css?/,
        include:APP_DIR,
        loader : 'style-loader!css-loader'
      }
    ]
  },


}

  module.exports = config;