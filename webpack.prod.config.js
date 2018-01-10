var baseConfig = require('./webpack.config.js');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// baseConfig.devtool = 'nosources-source-map';
baseConfig.devtool = 'source-map';
baseConfig.plugins.push(new UglifyJsPlugin({
    sourceMap: true,
    parallel: 2,
    uglifyOptions: {
        ie8: false,
        ecma: 8,
        warnings:false
    },
}));
module.exports = baseConfig;