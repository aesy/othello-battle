const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env) => ({
    context: path.resolve(__dirname, "src"),
    entry: {
        app: [
            "./app.js"
        ]
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].[hash].js"
    },
    devtool: env === "production" ? false : "eval-source-map",
    target: env === "test" ? "node" : "web",
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    plugins: [
                        "babel-plugin-transform-async-to-promises",
                        [
                            "@babel/plugin-proposal-class-properties",
                            {
                                "loose": true
                            }
                        ]
                    ],
                    presets: [
                        "@babel/preset-react",
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
    resolve: {
        extensions: [ ".js", ".jsx" ]
    },
    devServer: {
        contentBase: "build",
        port: 8080
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "index.html"
        })
    ]
});
