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

socket.on('newFile', function(data) {
  console.log('New File', data);
  var formattedTime = moment(data.createAt).format('h:mm a');

  var template = jQuery('#file-message-template').html();
  var html = Mustache.render(template, {
    from : data.from,
    filename: data.filename,
    size : data.size,
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

jQuery('#myFileInput').on('change', function (e) {
  console.log('Upload on change...' + e.target.files);
  var files = e.target.files;
  if (files && files.length) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      console.log('file.name...' + file.name);
      var dateString = formatAMPM(new Date());
      var DWid = params.name + "dwid" + Date.now();

      var fd = new FormData();
    	fd.append('file', file);
      fd.append('username', params.name);
      fd.append('usergroup', params.group);
			fd.append('dwid', DWid);
			fd.append('msgTime', dateString);
			fd.append('filename', file.name);

      jQuery.ajax({
        url: '/api/v1/upload',
        type: 'POST',
        data: fd,
        cache: false,
        datatype: 'json',
        processData: false,
        contentType: false,
        success:
          function(data, status, jqXHR) {
            console.log('File upload succeded...');
          },
        error:
          function(jqXHR, status, error) {
            console.log('File upload failed...' + error);
          }
      });
    }
  }
  });

function download(fileName) {

  var fd = new FormData();
  fd.append('filename', file.name);

  jQuery.ajax({
    url: '/api/v1/getFile',
    type: 'POST',
    data: fd,
    cache: false,
    datatype: 'json',
    processData: false,
    contentType: false,
    success:
      function(data, status, jqXHR) {
        console.log('File download succeded...');
      },
    error:
      function(jqXHR, status, error) {
        console.log('File download failed...' + error);
      }
  });
}

// message time formatting into string
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
