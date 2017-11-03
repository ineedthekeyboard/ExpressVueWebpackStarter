var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

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
        new ExtractTextPlugin({
            filename: 'bundle.css',
            allChunks: true
        })    
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.(png|svg|jpg|gif\ttf|eot)$/,
                use: [
                    'file-loader?name=[path][name].[ext]'
                ]
            }
        ],
        loaders: [
            
            
        ]
    },
    stats: {
        // Colored output
        colors: true
    },

    // Create Sourcemaps for the bundle
    devtool: 'source-map'
};