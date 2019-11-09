const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: {
        app: [
            "./app.js"
        ]
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].[hash].js"
    },
    devtool: "eval-source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    plugins: [
                        "babel-plugin-transform-async-to-promises",
                        "@babel/plugin-proposal-class-properties"
                    ],
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                useBuiltIns: "usage",
                                corejs: { version: 3, proposals: true },
                                targets: "> 5%, not dead",
                                debug: true
                            }
                        ]
                    ]
                }
            }
        ]
    },
    target: "node",
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "index.html"
        })
    ]
};