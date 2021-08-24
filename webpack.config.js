const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {
        background: './src/scripts/background.js',
        options: './src/scripts/options.js',
        popup: './src/scripts/popup.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/react', '@babel/env']
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{
                from: 'manifest.json',
                to: path.resolve(__dirname, 'dist'),
                context: 'src'
            }, {
                from: '*.html', 
                to: path.resolve(__dirname, 'dist'),
                context: 'src/pages'
            }, {
                from: '*.css', 
                to: path.resolve(__dirname, 'dist'),
                context: 'src/styles'
            }, {
                from: 'images/*', 
                to: path.resolve(__dirname, 'dist'),
                context: 'src'
            }]
        })
    ]
};