var express = require('express'),
    http    = require('http'),
    app     = express(),
    server  = false;

console.log('Configuring app.');

app.configure(function () {
    app.set('port', 1313);
});

app.get('/', function (req, res) {
    res.end('Welcome! This webserver is running at ' + app.get('port'));
});

server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Starting service at ' + app.get('port'));
});