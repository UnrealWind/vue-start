const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin')
const path = require('path')
module.exports = {
  configureWebpack: {
    resolve: { symlinks: false },
    plugins: [
      new ExtraWatchWebpackPlugin({
        dirs: [ path.resolve(__dirname, './src/pages') ]
      })
    ]
  }
}
