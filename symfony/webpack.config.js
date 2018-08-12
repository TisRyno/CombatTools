var fs  = require('fs');
var path    = require('path');
var webpack = require('webpack');
var assetsPlugin = require('assets-webpack-plugin');
//var autoprefixer = require('autoprefixer');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var isDev = process.env.NODE_ENV !== "production";

let config = {
    entry: {
        "frontend": [
            // Just the checkout and its dependencies
            "./app/Resources/js/entry"
        ]
    },
    output: {
        path: path.resolve(__dirname, './web/dist/v2'),
        filename: `[name]${isDev ? '' : '-[chunkhash]'}.js`, // We cannot use chunkash in development
        publicPath: (isDev ? 'https://www.dungeon-tools.com:8401/dist/v2/' : '/dist/v2/'),
    },
    resolve: {
        modules: [
            'node_modules',
            'app/Resources/js',
        ],
        extensions: ['.js', '.jsx', '.css', '.scss']
    },
    /*externals: {
        jquery: 'jQuery',
    },*/

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: 'babel-loader',
                // use: [
                //     {
                //         loader: 'babel-loader',
                //         options: {
                //             presets: ['react']
                //         }
                //     }
                // ],
            },
            {
                test: /\.s?css$/,
                use: isDev ? [
                    "style-loader",
                    "css-loader",
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: './postcss.config.js'
                            }
                        }
                    },
                    "sass-loader",
                ] : ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader",
                        {
                            loader: 'postcss-loader',
                            options: {
                                config: {
                                    path: './postcss.config.js'
                                }
                            }
                        },
                        "sass-loader"
                    ]
                }),
            },
            {
                test: /\.(svg|eot|ttf|woff|woff2)/i,
                use: [
                    'file-loader?hash=sha512&digest=hex&name=[name].[ext]&outputPath=fonts/',
                ],
            },
            {
                test: /\.(jpe?g|png|gif)/i,
                use: [
                    'file-loader?hash=sha512&digest=hex&name=[name].[ext]&outputPath=images/',
                ],
            },
        ]
    },
    plugins: [
        //new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.NamedModulesPlugin(),
        ...(isDev ? [] : [
            new BundleAnalyzerPlugin({
                analyzerMode: 'static'
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'head-scripts',
                chunks: ["head-scripts"],
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: function(module, count) {
                    return count >= 2;
                },
            }),
            new webpack.optimize.CommonsChunkPlugin({ 
                name: 'manifest',
            }),
            new ExtractTextPlugin({
                filename: '[name]-[contenthash].css',
                allChunks: true,
            }),
            new assetsPlugin({
                path: path.join(__dirname, 'web/dist/v2'),
                prettyPrint: true,
                filename: 'rev-manifest.json'
            }),
        ]),
    ],
};

if (isDev && fs.existsSync('/etc/nginx/ssl/server.crt')) {
    config.devServer = {
        host: '0.0.0.0',
        disableHostCheck: true,
        port: 8401,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        watchOptions: { // Needed as we run webpack on vagant, sharing the
            poll: true
        },
        https: true,
        cert: fs.readFileSync('/etc/nginx/ssl/server.crt'),
        key: fs.readFileSync('/etc/nginx/ssl/server.key'),
    };
}

module.exports = config;
