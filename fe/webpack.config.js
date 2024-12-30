const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");

// dotenv 파일 로드
const env = dotenv.config().parsed || {};

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: {
    static: "./dist",
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: true,
      templateParameters: {
        GOOGLE_MAPS_API_KEY: env.REACT_APP_GOOGLE_MAP_API_KEY || "",
      },
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(env),
    }),
  ],
};
