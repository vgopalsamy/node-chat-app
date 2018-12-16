const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const {generateMessge} = require("./util/message");
const {Users} = require("./util/users");

const publicpath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var users = new Users();

app.use(express.static(publicpath));

io.on('connect', (socket) => {
  console.log('New user connected');
  socket.on('join', (params, callback) => {
    socket.emit('newMessage', generateMessge('Admin', 'Welcome to chat app'));
    socket.broadcast.to(params.group).emit('newMessage', generateMessge('admin', `${params.name} has joined`));
    socket.join(params.group);

    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.group);
    io.to(params.group).emit('updatedUserList', users.getUserList(params.group));
    });

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    var user = users.getUser(socket.id);
    io.to(user.group).emit('newMessage', generateMessge(message.from, message.text));
    callback();
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    console.log('user left', user);
    if(user) {
      io.to(user.group).emit('updatedUserList', users.getUserList(user.group));
      io.to(user.group).emit('newMessage', generateMessge(user.name, `${user.name} has left`));
    } else {

    }
  });
});

server.listen (3000, () => {
  console.log("Server started on port 3000");
});
