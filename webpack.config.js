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
    }
};