const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    // entry: {
    //     main: './src/assets/lib_init.js',
    //     controllers: './src/assets/controllers.js',
    // },
    entry: {
        main: './src/assets/lib_init.js', // Main JavaScript entry
        styles: './src/assets/styles/style.css', // CSS entry
    },
    output: {
        filename: '[name].js', // Use placeholders to create unique filenames
        path: path.resolve(__dirname, 'dist'),
    },
    // entry: './src/assets/lib_init.js', // Entry point
    // output: {
    //     filename: 'controllers.js', // Output JS file
    //     path: path.resolve(__dirname, 'dist'), // Output directory
    //     library: 'sf_ui_lib',
    //     libraryTarget: 'umd',
    // },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader', // Convert CSS into CommonJS
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Optional, for ES6+ support
                },
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/, // Optimize images
                type: 'asset',
                generator: {
                    filename: 'images/[hash][ext][query]',
                },
            },
        ],
    },

    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({ // Optimize JavaScript
                terserOptions: {
                    compress: {
                        drop_console: true, // Remove console.logs
                    },
                },
            }),
            new CssMinimizerPlugin(), // Optimize CSS
        ],
        splitChunks: { // Split vendor and app code
            chunks: 'all',
        },
        runtimeChunk: 'single', // Separate runtime chunk
    },
    plugins: [
        new CleanWebpackPlugin(), // Clean output directory
        new MiniCssExtractPlugin({ // Extract CSS into files
            filename: '[name].css',
        }),
    ],
};