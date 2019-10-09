require("idempotent-babel-polyfill");
// require("babel-core/register");

const path = require("path");
const webpack = require("webpack");

const WatchLiveReloadPlugin = require("webpack-watch-livereload-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");

const minifyOpts = {};
const pluginOpts = {
  comments: false
};

module.exports = {
  entry: "./src/scripts/index.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname + "/build"),
    library: "TinderAi",
    filename: "index.js",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  plugins: [new MinifyPlugin(minifyOpts, pluginOpts)],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: "babel-loader"
      }
    ]
  }
};
