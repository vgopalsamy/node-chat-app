const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const formidable = require('formidable');		// file upload module
const bodyParser = require('body-parser');	// body-parser module for reading request body
const moment = require('moment')

const {generateMessge} = require("./util/message");
const {Users} = require("./util/users");

const publicpath = path.join(__dirname, '../public');
const publicUploadPath = path.join(__dirname, '../public/upload');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var users = new Users();

// cofiguring body-parser
app.use(bodyParser.json({	// setting json limit
    limit: 1024 * 10000
}));
app.use(bodyParser.text({ 	// setting text limit
    limit: 1024 * 10000
}));
app.use(bodyParser.raw({ 	// setting raw limit
    limit: 1024 * 10000
}));
app.use(bodyParser.urlencoded({		// setting url encoding
    extended: true
}));

app.use(express.static(publicpath));
app.use(express.static(publicUploadPath));

// CORS Issue Fix
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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

//route for uploading files asynchronously
app.post('/api/v1/upload',function (req, res) {

  console.log('Calling api/v1/upload...');

  var imgdatetimenow = Date.now();
  var form = new formidable.IncomingForm({
        uploadDir: publicUploadPath,
        keepExtensions: true
      });

  form.on('end', function() {
      res.end();
    });

  form.parse(req, function(err, fields, files) {
    var data = {
        from : fields.username,
        filename : baseName(files.file.path),
        size : bytesToSize(files.file.size),
        createAt : moment.valueOf()
    };

    console.log("new file:" + fields.usergroup);
    io.to(fields.usergroup).emit('newFile', data);
  });
});


// route for checking requested file , does exist on server or not
app.post('/v1/getfile', function(req, res){
});

//get file name from server file path
function baseName(str) {
   var base = new String(str).substring(str.lastIndexOf('\\') + 1);
   return base;
}

// Size Conversion
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
};


server.listen (3000, () => {
  console.log("Server started on port 3000");
});
