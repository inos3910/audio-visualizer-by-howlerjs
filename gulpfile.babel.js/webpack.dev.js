import { merge }  from 'webpack-merge'
import common     from './webpack.common.js'

module.exports = merge(common, {
  mode     : 'development',
  devtool  : 'cheap-module-eval-source-map',
});
