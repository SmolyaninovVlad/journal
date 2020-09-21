var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

module.exports = {
    // mode: 'development',
    entry: ["./src/index.js"],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
              test: /\.(m?js|jsx)$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/env', '@babel/react']
                }
              }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.otf$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                  name: '[name].[contenthash].[ext]',
                  outputPath: 'static/assets/',
                  publicPath: 'static/assets/',
                  postTransformPublicPath: (p) => `__webpack_public_path__ + ${p}`,
                },
            },
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.ProvidePlugin({
            Promise: ['es6-promise', 'Promise']
        })
    ],
    output: {
        filename:  'static.main.js',
    },
    devServer: {
        historyApiFallback: true
    }
}