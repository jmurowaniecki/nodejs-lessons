var express = require('express'),
    http    = require('http'),
    fs      = require('fs'),
    app     = express(),
    about   = require('./package.json'),
    server  = false;

console.log('Configuring app.');

app.configure(function () {
    app.set('port', 1313);
});

// Welcome page
app.get('/', function (req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) {
            res.statusCode = 500;
            // In some other examples we see res.writeHead(500)
            // http://nodejs.org/api/http.html#http_response_writehead_statuscode_reasonphrase_headers
            return res.end('Error while load index.html');
        }
        res.writeHead(200);
        res.end(data);
    });
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