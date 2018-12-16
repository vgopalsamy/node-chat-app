var socket = io();

var params;

socket.on('connect', function() {
  params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function(err) {
    if(err) {

    } else {

    }
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected to server');
});

socket.on('newMessage', function(message) {
  console.log('New messsage', message);
  var formattedTime = moment(message.createAt).format('h:mm a');

  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    from : message.from,
    text: message.text,
    createAt: formattedTime
  });

  jQuery('#messages').append(html);
});

socket.on('updatedUserList', function(users) {
  console.log(users);
  var ol = jQuery('<ol></ol>');
  users.forEach(function(user) {
    console.log("1");
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
});

jQuery('#form').on('submit', function (e) {
  e.preventDefault();
  var msgTxtBox = jQuery('#message');
  console.log('submit message');
  socket.emit('createMessage', {
    from: params.name, text: msgTxtBox.val(), createAt: new Date().getDate()
  }, function() {
    msgTxtBox.val('');
  });
});
