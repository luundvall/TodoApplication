const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const path = require('path');
const precss = require('precss');

// const TransferWebpackPlugin = require('transfer-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const env = process.env.NODE_ENV;

var webpackConfig = {
    mode: env || 'production',
    devtool: 'eval',
    entry: [
        'webpack/hot/only-dev-server',
        'font-awesome/scss/font-awesome.scss',
        './src/index.js'
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/main.js'
    },
    devServer: {
        contentBase: 'dist/', // Relative directory for base of server
        publicPath: '/',
        inline: true,
        port: process.env.PORT || 3000, // Port Number
        host: 'localhost', // Change to '0.0.0.0' for external facing server
        historyApiFallback: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
            Button: 'exports-loader?Button!bootstrap/js/dist/button',
            Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
            Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
            Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
            Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
            Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
            Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
            Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
            Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
            Util: 'exports-loader?Util!bootstrap/js/dist/util'
        }),
        new MiniCssExtractPlugin({
                filename: 'css/main.css',
            })
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                },
            },
            {
                test: /\.(scss|css)$/, use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ]

            },
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'url-loader?limit=10000',
            },
            {
                test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
                use: 'file-loader',
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'file-loader?name=images/[name].[ext]',
                    'image-webpack-loader?bypassOnDebug'
                ]
            },
            // font-awesome
            {
                test: /font-awesome\.config\.js/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'font-awesome-loader' }
                ]
            },
            // Bootstrap 4
            {
                test: /bootstrap\/dist\/js\/umd\//, use: 'imports-loader?jQuery=jquery'
            }
        ]
    }
};

if (process.env.NODE_ENV === 'development') {
    webpackConfig.debug = true;
    webpackConfig.devtool = 'sourcemap';
    webpackConfig.output.pathinfo = true;
}

if (process.env.NODE_ENV === 'production') {
    webpackConfig.plugins.push(new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    }));
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
}


module.exports = webpackConfig;
