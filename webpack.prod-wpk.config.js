// used to build assets to be used in Symfony projects that use Webpack as assets manager

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        main: './src/assets/lib_init.js', // Main JavaScript entry
        styles: './src/assets/styles/style.css', // CSS entry
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/dist-wpk'), // Output directory
        // library: 'sf_ui_lib',
        libraryTarget: 'module',
        publicPath: '/bundles/remotetechsfstimulusturboui/dist-wpk/'
    },
    experiments: {
        outputModule: true, // Enable module output
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
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/, // Match font files
                type: 'asset/resource',
                generator: {
                    filename: '[name][ext]', // Custom output for fonts
                    publicPath: './vendor/remote-tech/sf-stimulus-turbo-ui-lib/public/dist-wpk/',// Override public path for font files
                },
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css', // Output CSS file
        }),
    ],

    mode: 'production', // Set to 'production' for minified output
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    optimization: {
        runtimeChunk: 'single',
        usedExports: true, // Mark used exports,
        splitChunks: {
            minSize: 10000,
            maxSize: 250000,
        }
    }
};