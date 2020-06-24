const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: "./app/main.ts",
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: { loader: 'ts-loader' }
            }, {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader'
                }
            }, {
                test: /\.scss$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { loader: "sass-loader" }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './app/index.html',
        })
    ]
}