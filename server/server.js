const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const {generateMessge} = require("./util/message");
const publicpath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicpath));

io.on('connect', (socket) => {
  console.log('New user connected');

  socket.emit('newMesssage', generateMessge('Admin', 'Welcome to chat app'));
  socket.broadcast.emit('newMessage', generateMessge('admin', 'New user joined'));

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessge(message.from, message.text));
    callback();
  });
});

server.listen (3000, () => {
  console.log("Server started on port 3000");
});
