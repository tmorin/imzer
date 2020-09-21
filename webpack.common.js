const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {GenerateSW} = require('workbox-webpack-plugin');
const pkg = require('./package.json');

module.exports = {
    target: 'web',
    entry: {
        'index': './src/index.js',
        'background': './src/background.js',
        'service-worker': './src/service-worker.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {test: /\.m?js$/, exclude: /node_modules/, loader: 'babel-loader'},
            {test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=1000'},
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=1000&mimetype=application/font-woff'},
            {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=1000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=1000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=1000'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=1000&mimetype=image/svg+xml'},
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src', force: true, globOptions: {
                        ignore: ['**/*.js', '**/*.scss', '**/*.ejs']
                    }
                },
                {from: 'node_modules/leaflet/dist/images', to: 'images', force: true}
            ]
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.ejs',
            pkg: pkg,
            excludeChunks: ['background', 'service-worker'],
            hash: true
        }),
        new GenerateSW({
            exclude: [
                /background\.js$/,
                /manifest\.json$/
            ]
        })
    ]
};
