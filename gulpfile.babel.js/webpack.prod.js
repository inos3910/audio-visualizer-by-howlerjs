import { merge }       from 'webpack-merge'
import common          from './webpack.common.js'
//import UglifyJSPlugin  from 'uglifyjs-webpack-plugin'
import TerserPlugin    from 'terser-webpack-plugin'

module.exports = merge(common, {
  mode     : 'production',
  // plugins  : [
  // new UglifyJSPlugin({
  //   uglifyOptions: {compress: {drop_console: true}},
  // })
  //]
  optimization: {
    minimizer: [
    new TerserPlugin({
      terserOptions: {
        compress: {drop_console: true}
      }
    })
    ],
  }
});