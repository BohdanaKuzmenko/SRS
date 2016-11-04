var path = require('path');
var webpack = require('webpack');

module.exports = {
    resolve: {
        root: path.resolve('./app'),
        extensions: ['', '.js']
    },
    proxy: {
        "**": "http://localhost:8080"
    },

    entry: [
        'webpack-dev-server/client?http://localhost:3000', // WebpackDevServer host and port
        'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
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
                loaders: ['react-hot', 'babel?presets[]=es2015&presets[]=react'],
                exclude: /node_modules/,
                include: path.join(__dirname, 'app')
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            "_": "underscore",
            "React": "react",
            "ReactDOM": "react-dom",
            "Highcharts": "highcharts"
        })
    ]
};