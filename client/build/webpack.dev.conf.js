'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  devtool: config.dev.devtool,
  devServer: {
    disableHostCheck: true,
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true,
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  optimization: {
    nodeEnv: 'development',
    namedModules: true,
    noEmitOnErrors: true,
    concatenateModules: true,
    splitChunks: {
      name: 'vendor',
      minChunks: 2,
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env'),
      // TODO: change post deploy
      API_BASE_URL: JSON.stringify('https://dev.inspectiv.io/api'),
      BUGSNAG_CLIENT_KEY: JSON.stringify('f96c3e90d58f2de786c811874edf7ab7'),
      DEFAULT_PROGRAM_IMAGE: JSON.stringify('/static/images/avatar-endpoint.svg'),
      DEFAULT_TEMPLATE_IMAGE: JSON.stringify('/static/images/avatar-template.svg'),
      DEFAULT_COMPANY_IMAGE: JSON.stringify('/static/images/avatar-company.svg'),
      DEFAULT_USER_IMAGE: JSON.stringify('/static/images/avatar-person.svg'),
      RECAPTCHA_SITE_KEY: JSON.stringify('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'),
      VUE_APP_TITLE: JSON.stringify('Inspectiv - Bug Bounty Platform'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      },
    ]),
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      process.env.PORT = port
      devWebpackConfig.devServer.port = port
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
