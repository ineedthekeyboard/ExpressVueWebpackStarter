var webpack = require("webpack"),
    baseConfig = require("./webpack.config.js");

baseConfig.entry = ['webpack-hot-middleware/client'].concat(baseConfig.entry);
baseConfig.output.publicPath = "/";
baseConfig.plugins.concat([
    new webpack.HotModuleReplacementPlugin()
]);
module.exports = baseConfig;