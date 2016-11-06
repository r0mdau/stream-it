var env = require('./env');
var io = require('socket.io').listen(env.socketPort);
var ss = require('socket.io-stream');
var express = require('express');
var app = express();

app
    .set('view engine', 'jade')
    .set('views', 'app/views')
;

app
    .get('/', function (req, res) {
        res.redirect('/sender')
    })
    .get('/sender', function (req, res) {
        res.render('sender.jade', {env: env});
    })
    .get('/receiver', function (req, res) {
        res.render('receiver.jade', {env: env});
    })
;

app
    .use('/socket.io-stream', express.static(__dirname + '/../node_modules/socket.io-stream'))
    .use(function(req, res){
        res.redirect('/sender');
    })
;

app.listen(env.port);

var senderSocket;

io.on("connection", function (socket) {
    socket.on('getId', function () {
        this.emit('getId', this.id);
    });

    socket.on('setSenderSocket', function (id) {
        senderSocket = io.sockets.connected[id];
    });

    var senderStream = ss.createStream();
    ss(socket).on('needFile', function (receiverStream) {
        ss(senderSocket).emit('giveMeTheFile', senderStream);
        senderStream.pipe(receiverStream);
    });
});