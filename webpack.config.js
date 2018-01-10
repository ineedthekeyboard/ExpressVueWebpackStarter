var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var DIST_DIR = path.join(__dirname, 'public'),
    DEV_DIR = path.join(__dirname, 'frontend');
module.exports = {
    context: DEV_DIR,
    entry: ['./main.js'],

    output: {
        path: DIST_DIR,
        filename: 'bundle.js',
        publicPath: '/'
    },
    plugins: [
        new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
        new HtmlWebpackPlugin({
            template: path.join(DEV_DIR, 'index.html')
        })
    ],
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    module: {
        // Special compilation rules
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            },
            {
                // Ask webpack to check: If this file ends with .vue, then apply some transforms
                test: /\.vue$/,
                // don't transform node_modules folder (which don't need to be compiled)
                exclude: /(node_modules|bower_components)/,
                // Transform it with vue
                use: {
                    loader: 'vue-loader'
                }
            },
            {
                test: /\.(png|svg|jpg|gif\ttf|eot)$/,
                use: [
                    'file-loader?name=[path][name].[ext]'
                ]
            }
        ]
    }
}