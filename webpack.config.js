var path = require('path');
var webpack = require('webpack');

module.exports = {
    resolve: {
        root: path.resolve('./app'),
        extensions: ['', '.js']
    },
    // proxy: {
    //     "**": "http://192.168.1.52:8080"
    // },

    entry: [
        './app/main' // Your appʼs entry point
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel?presets[]=es2015&presets[]=react'],
                exclude: /node_modules/,
                include: path.join(__dirname, 'app')
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            "_": "underscore",
            "React": "react",
            "ReactDOM": "react-dom"
        })
    ]
};