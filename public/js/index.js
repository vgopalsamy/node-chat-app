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
  var msgTxtBox = jQuery('#message');

  socket.emit('createMessage', {
    from: "UI", text: msgTxtBox.val(), createAt: new Date().getDate()
  }, function() {
    msgTxtBox.val('');
  });
});
