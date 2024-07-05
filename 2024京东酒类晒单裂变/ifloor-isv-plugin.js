const {
  removePlugins,
  pluginByName,
  getLoaders,
  loaderByName,
  getPlugin
} = require('@craco/craco')
const ZipPlugin = require('zip-webpack-plugin');
module.exports = (option)=>{
  return {
    overrideDevServerConfig({ webpackDevConfig, context }) {
      return webpackDevConfig;
    },
    overrideWebpackConfig({ webpackConfig, context }) {
      getLoaders(webpackConfig, loaderByName('babel-loader')).matches.forEach((e) => {
        e.loader.options.plugins.push([
          'styled-components-px2vw',
          {
            unitToConvert: 'px',
            unitPrecision: 5,
            minPixelValue: 0,
          },
        ])
      });
      if(context.env === 'production') {
        webpackConfig.output.filename = 'js/[name].[contenthash:8].js';
        webpackConfig.output.chunkFilename = 'js/[name].[contenthash:8].chunk.js';
        removePlugins(webpackConfig,  pluginByName('ZipPlugin'));
        webpackConfig.plugins.push(new ZipPlugin({
          path: '../', filename: 'ifloor.zip', pathPrefix: 'ifloor', exclude: [/\.map/]
        }))
        const miniCssExtractPlugin = getPlugin(webpackConfig, pluginByName('MiniCssExtractPlugin')).match;
        miniCssExtractPlugin.options.filename = 'css/[name].[contenthash:8].css',
        miniCssExtractPlugin.options.chunkFilename = 'css/[name].[contenthash:8].css';
        getLoaders(webpackConfig, loaderByName('url-loader')).matches.forEach((e) => {
          e.loader.options.name = 'media/[name].[hash:8].[ext]';
        });
        getLoaders(webpackConfig, loaderByName('file-loader')).matches.forEach((e) => {
          e.loader.options.name = 'media/[name].[hash:8].[ext]';
        });
      }
      return webpackConfig;
    }
  }
}