const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    login: './src/js/login.js',
    mypage: './src/js/mypage.js',
    'register-email': './src/js/register-email.js',
  },
  output: {
    path: `${__dirname}/public`,
    filename: '[name].bundle.js',
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: `${__dirname}/src/html`,
          to: `${__dirname}/public`,
        },
        {
          from: `${__dirname}/src/style.css`,
          to: `${__dirname}/public`,
        },
      ],
    }),
  ],
};
