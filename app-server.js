var express = require('express'),
    http    = require('http'),
    app     = express(),
    about   = require('./package.json'),
    server  = false;

console.log('Configuring app.');

app.configure(function () {
    app.set('port', 1313);
});

// Welcome page
app.get('/', function (req, res) {
    res.end('Welcome! This webserver is running at ' + app.get('port'));
});

// About page
app.get('/about', function (req, res) {
    res.end(about.name + ' was developed by ' + about.author);
});

// Meeting page
app.get('/mynameis/:name', function (req, res) {
    res.end('Hello, ' + req.params.name + '!');
});

// Default 404 error page routing
app.get('*', function (req, res) {
    res.send('Unknow page ' + req.params, 404);
});

server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Starting service at ' + app.get('port'));
});