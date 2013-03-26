var express  = require('express'),
    http     = require('http'),
    fs       = require('fs'),
    app      = express(),
    about    = require('./package.json'),
    server   = false,
    mongoose = require('mongoose'),
    db       = mongoose.createConnection('localhost', 'twitter'),
    Schema   = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId;

console.log('Configuring app.');

app.configure(function () {
    app.set('port', 1313);
});

mongoose.connect('mongodb://localhost/twitter');
mongoose.connection.on('open', function () {
    console.log('mongoose openned..');
});


var UserSchema = new Schema({
    name     : String,
    messages : [{
        type: Schema.ObjectId,
        ref: 'Message'
    }]
}), User    = mongoose.model('User', UserSchema);

var MessageSchema = new Schema({
    user    : {
        type: Schema.ObjectId,
        ref: 'User'
    },
    message : String,
    date    : {
        type: Date,
        default: Date.now
    }
}), Message = mongoose.model('Message', MessageSchema);



// Welcome page
app.get('/', function (req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);

        Message
        .find({}, null, {
            sort : { 'date' : -1 }
        })
        .populate('user')
        .limit(50)
        .exec(function (err, messages) {
            return res.end(parseTextWithObject(data, {
                content  : "Loading messages",
                messages : JSON.stringify(messages)
            }));
        });
    });
});

// About page
app.get('/about', function (req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(parseTextWithObject(data, {
            content: '<b>' + about.name + '</b> was developed by ' + about.author
        }));
    });
});

// Meeting page
app.get('/mynameis/:name', function (req, res) {
    res.end('Hello, ' + req.params.name + '!');
});

app.get('/whois/:user', function (req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        User
        .findOne({ name: req.params.user })
        .exec(function (err, user) {
            console.dir(user);
            if (err || user === null)
            {
                return res.end(parseTextWithObject(data, {
                    content  : 'Invalid user',
                    messages : ''
                }));
            }
            Message
            .find({ user: user._id }, null, {
                sort : { 'date' : 1 }
            })
            .populate('user')
            .limit(50)
            .exec(function (err, message) {
                return res.end(parseTextWithObject(data, {
                    content  : 'Loading messages',
                    messages : JSON.stringify(message)
                }));
            });
        });
    });
});


app.get('/say/:user/:message', function (req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);

        User.findOne({name:req.params.user}, function (err, UserExist) {
            if (UserExist === null) {
                var newUser = new User({ name:req.params.user });
                newUser.save(function (err, UserExist) {
                    var newMsg = new Message({ message: req.params.message, user: UserExist });
                    newMsg.save(function(err, MsgData){
                        newUser.messages.push(MsgData._id);
                        newUser.save(function(){
                            return res.end(parseTextWithObject(data, {
                                content  : 'Saving message from ' + req.params.user,
                                messages : ''
                            }));
                        });
                    });
                });
            }
            else {
                var newMsg = new Message({ message: req.params.message, user: UserExist });
                newMsg.save(function(err, MsgData){
                    console.dir(req.params.user);
                    UserExist.messages.push(MsgData._id);
                    UserExist.save(function(){
                        return res.end(parseTextWithObject(data, {
                            content  : 'Saving message from ' + req.params.user,
                            messages : ''
                        }));
                    });
                });
            }
        });
    });
});
// Default 404 error page routing
app.get('*', function (req, res) {
    res.send('Unknow page ' + req.params, 404);
});

server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Starting service at ' + app.get('port'));
});

function loadFile (filename, parseWith) {

}

function parseTextWithObject (text, object) {
    console.log('parsing');
    for (i in object) {
        text = text.toString().replace('{{' + i + '}}', object[i]);
    }
    return text;
}