const path = require("path");
const fs = require("fs");
let html = fs.readFileSync('./app/index.html').toString()
html = html.replace(/\/static/g, './static')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
~function (p) {      //删掉dist文件夹
    let files = [];
    if (fs.existsSync(p)) {
        if (fs.statSync(p).isDirectory()) {
            files = fs.readdirSync(p);
            files.forEach((file, index) => {
                var curPath = p + "/" + file;
                if (fs.statSync(curPath).isDirectory()) {
                    arguments.callee(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(p);
        } else {
            fs.unlinkSync(p);
        }
    }
}(path.resolve(__dirname, 'dist'));
module.exports = {
    entry: "./app/main.ts",
    output: {
        publicPath: './',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: { loader: 'ts-loader' }
            }, {
                test: /\.(html)$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }

                }]
            }, {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: './img'
                        }
                    }
                ]
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
            templateContent: ({ htmlWebpackPlugin }) => html,
            hash: true,
            minify: true,
            minifyJS: true,
        }),
        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve('./static'),
                to: "./static",
            }]
        }),
    ]
}