var http = require("http"),
    url = require('url'),
    fs = require('fs'),
    querystring = require('querystring'),
    httpProxy = require('http-proxy'),
    mine = require('./fileType').types,//静态资源文件类型
    path = require('path');

var pro = function (_config) {
    var proxy = httpProxy.createProxyServer({});

    proxy.on('error', function (err, req, res) {
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        res.end('Something went wrong. And we are reporting a custom error message.');
    });

    var server = http.createServer(function (req, res) {
        var _ipAddress = req.headers.x_forwarded_for ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        var pathname = url.parse(req.url).pathname;
        var isServer = false;
        for(var i in _config.serverConfig) {
            for(var n in _config.serverConfig[i].path) {
                if(_config.serverConfig[i].path[n] == pathname && !isServer) {
                    isServer = _config.serverConfig[i].port;
                }
            }
        }
        if(isServer) {
            proxy.web(req, res, {target: 'http://localhost:' + isServer});
        } else {
            var isWebsite = false;
            for(var i in _config.siteConfig) {
                if(_config.siteConfig[i].doMain == req.headers.host || _config.siteConfig[i].isDebug && !isWebsite) {
                    isWebsite = _config.siteConfig[i].webFile;
                }
            }
            if(isWebsite) {
                var realPath = path.join("./", pathname);
                if (realPath == ".\\" || realPath == "./") {
                    realPath = "index.html";
                }
                realPath = isWebsite + "/" + realPath.replace(/\\/gm, '/');
                var ext = path.extname(realPath);
                ext = ext ? ext.slice(1) : 'unknown';
                fs.exists(realPath, function (exists) {
                    realPath = exists ? realPath : _config.errorConfig;
                    fs.readFile(realPath, "binary", function (err, file) {
                        if (err) {
                            console.log("error:",new Date().toLocaleDateString(), new Date().toLocaleTimeString(), "ip:", _ipAddress, ",type:" + req.method.toUpperCase(), ",url:", pathname);
                            res.writeHead(500, {
                                'Content-Type': 'text/plain'
                            });
                            res.end("404 page not found");
                        } else {
                            var contentType = mine[ext] || "text/html";
                            res.writeHead(200, {
                                'Content-Type': contentType
                            });
                            res.write(file, "binary");
                            res.end();
                        }
                    });
                });
            }
        }
    });
    console.log(new Date().toLocaleDateString(), new Date().toLocaleTimeString(), "proxy start port:", _config.port);
    server.listen(_config.port);
};
module.exports = pro;