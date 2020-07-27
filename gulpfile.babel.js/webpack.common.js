import webpack                from 'webpack'
import EncodingPlugin         from 'webpack-encoding-plugin'
import path                   from 'path'
import {paths}                from './config.js'

module.exports = {
  cache    : true,
  output   : {
    filename : '[name].bundle.js',
  },
  plugins  : [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.AggressiveMergingPlugin(),
  new EncodingPlugin({
    encoding: 'utf-8'
  })
  ],
  module: {
    rules: [
    {
      test: /\.js$/,
      exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }]
    }
    ]
  },
  resolve: {
    modules    : ["node_modules"],
    extensions : ['.js'],
    alias      : {
      '@as' : paths.assetsDir,
      '@js' : paths.jsSrcDir
    }
  }
};