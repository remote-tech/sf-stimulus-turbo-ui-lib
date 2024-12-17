const path = require('path');

// module.exports = {
//     entry: './src/assets/*', // Entry point for your JavaScript
//     output: {
//         filename: 'sf-stimulus-ui-lib.js', // Output file name
//         path: path.resolve(__dirname, '/dist'), // Output directory
//         library: 'sf-stimulus-ui-lib'
//     },
//     mode: "production",
//     module: {
//         rules: [
//             {
//                 test: /\.css$/, // Apply loaders to CSS files
//                 use: ['style-loader', 'css-loader'],
//             },
//             // {
//             //     test: /\.(png|svg|jpg|gif)$/, // Apply loaders to image files
//             //     use: ['file-loader'],
//             // },
//         ],
//     },
//     performance: {
//         hints: false,
//         maxEntrypointSize: 512000,
//         maxAssetSize: 512000
//     },
//     optimization: {
//         splitChunks: {
//             minSize: 10000,
//             maxSize: 250000,
//         }
//     }
// };


const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    // entry: './src/assets/lib_init.js', // Entry point
    entry: {
        main: './src/assets/lib_init.js', // Main JavaScript entry
        styles: './src/assets/styles/style.css', // CSS entry
    },
    output: {
        // filename: 'controllers.js', // Output JS file
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'), // Output directory
        library: 'sf_ui_lib',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.css$/, // Handle .css files
                use: [
                    MiniCssExtractPlugin.loader, // Extract CSS to a file
                    'css-loader', // Convert CSS into CommonJS
                ],
            },
            {
                test: /\.js$/, // Handle .js files
                exclude: /node_modules/, // Exclude node_modules
                use: {
                    loader: 'babel-loader', // Optional, for ES6+ support
                },
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css', // Output CSS file
        }),
    ],
    // devServer: {
    //     static: {
    //         directory: path.join(__dirname, 'dist'), // Specify the directory for static files
    //     },
    //     compress: true,
    //     port: 9100,
    // },

    mode: 'production', // Set to 'production' for minified output
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    optimization: {
        usedExports: true, // Mark used exports,
        splitChunks: {
            minSize: 10000,
            maxSize: 250000,
        }
    }
};