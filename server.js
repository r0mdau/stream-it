var io = require('socket.io').listen(90);
var ss = require('socket.io-stream');
var fs = require('fs');

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