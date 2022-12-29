const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.js",
  },
  output: {
    path: `${__dirname}/../server/public`,
    filename: "[name].bundle.js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: `${__dirname}/src/index.html`,
          to: `${__dirname}/../server/public/index.html`,
        },
        {
          from: `${__dirname}/src/style.css`,
          to: `${__dirname}/../server/public/style.css`,
        },
      ],
    }),
  ],
};
