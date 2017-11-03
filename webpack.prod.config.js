var baseConfig = require('./webpack.config.js');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

//baseConfig.devtool = 'nosources-source-map';
baseConfig.devtool = 'cheap-source-map';
module.exports = baseConfig;