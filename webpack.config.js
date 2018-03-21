const externals = require("webpack-node-externals");

module.exports = {
  externals: externals(),
  module: {
    rules: [{ test: /\.js$/, use: "babel-loader" }]
  }
};
