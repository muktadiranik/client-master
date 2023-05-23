'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true,
    }),
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
  },
  optimization: {
    concatenateModules: true,
    nodeEnv: 'development',
    minimize: true,
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      name: true,
      maxAsyncRequests: 7,
      maxInitialRequests: 5,
      cacheGroups: {
        vendors: {
          chunks: 'initial',
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          enforce: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env'),
      API_BASE_URL: JSON.stringify('http://127.0.0.1:8000/api'),
      BUGSNAG_CLIENT_KEY: JSON.stringify('f96c3e90d58f2de786c811874edf7ab7'),
      DEFAULT_PROGRAM_IMAGE: JSON.stringify('/static/images/avatar-endpoint.svg'),
      DEFAULT_TEMPLATE_IMAGE: JSON.stringify('/static/images/avatar-template.svg'),
      DEFAULT_COMPANY_IMAGE: JSON.stringify('/static/images/avatar-company.svg'),
      DEFAULT_USER_IMAGE: JSON.stringify('/static/images/avatar-person.svg'),
      RECAPTCHA_SITE_KEY: JSON.stringify('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'),
      VUE_APP_TITLE: JSON.stringify('Inspectiv - Bug Bounty Platform'),
    }),
    new TerserPlugin({
      sourceMap: config.build.productionSourceMap,
      parallel: true,
    }),
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[md5:contenthash:hex:20].css'),
      allChunks: true,
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true },
    }),
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
      chunksSortMode: 'none',
    }),
    new webpack.HashedModuleIdsPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*'],
      },
    ]),
  ],
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' + config.build.productionGzipExtensions.join('|') + ')$',
      ),
      threshold: 10240,
      minRatio: 0.8,
    }),
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
