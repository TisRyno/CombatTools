const webpackConfig = require('./webpack.config');

let dockerWebpackConfig = Object.assign({}, webpackConfig);

dockerWebpackConfig.devServer = {
// webpackConfig.devServer = {
    host: '0.0.0.0',
    disableHostCheck: true,
    port: 8401,
    headers: {
        "Access-Control-Allow-Origin": "*"
    },
    watchOptions: {
        // poll: 5000,
        ignored: /node_modules/,
    },
    https: false,
};

module.exports = dockerWebpackConfig;
