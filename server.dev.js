const path = require('path');
const express = require('express');
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();

var app = function () {
    const apiHost = 'http://127.0.0.1:8080';
    const app = express();
    const indexPath = path.join(__dirname, '/index.html');
    const dist = express.static(path.join(__dirname, '/dist'));
    const staticDir = express.static(path.join(__dirname, '/static'));

    app.use('/dist', dist);
    app.use('/static', staticDir);
    app.get('/', function (_, res) {
        res.sendFile(indexPath)
    });
    app.get("/start-session", function (req, res) {
        apiProxy.web(req, res, {target: apiHost});
    });
    app.get("/login", function (req, res) {
        apiProxy.web(req, res, {target: apiHost});
    });
    app.get("/api/*", function (req, res) {
        apiProxy.web(req, res, {target: apiHost});
    });


    console.log(apiHost);
    return app
};

app().listen(3000, '0.0.0.0');