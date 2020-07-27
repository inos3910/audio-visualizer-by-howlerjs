//本番モードフラグ
const is_production = process.env.NODE_ENV === 'production';
import dev_config   from './webpack.dev'
import prod_config  from './webpack.prod'

module.exports = is_production ? prod_config : dev_config;