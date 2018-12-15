var socket = io();

socket.on('connect', function() {
  console.log('Connected to server');
});

socket.on('disconnect', function() {
  console.log('Disconnected to server');
});

socket.on('newMessage', function(message) {
  console.log('New messsage', message);
  var newMsg = jQuery('<li></li>');
  newMsg.text(`${message.from} : ${message.text}`);

  jQuery('#messages').append(newMsg);
});

jQuery('#form').on('submit', function (e) {
  e.preventDefault();
  console.log('Button Clicked..');

  var msg = jQuery('#message').val();
  console.log("message", msg);

  socket.emit('createMessage', {
    from: "UI", text: msg, createAt: new Date().getDate()
  }, function() {
    console.log("Acknowledge !!");
  });
});
