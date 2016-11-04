var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    proxy: {
        "/attorneys/analytics/api/*": "http://localhost:5001"
    }
}).listen(3000, '0.0.0.0',  function (err, result) {
    if (err) {
        return console.log(err);
    }

    console.log('Listening at http://localhost:3000/');
});