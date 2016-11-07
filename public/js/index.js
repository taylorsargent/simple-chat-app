/* eslint-disable */
function scrollToBottom() {
  var heights = $('#messages li')
    .toArray()
    .map(function (li) {
      return $(li).height();
    });

  if (heights.length > 0) {
    $('#messages').scrollTop(heights.reduce(function(a, b) {
      return a + b;
    }));
  }
}

function saveToSessionStorage(key, item, json) {
  sessionStorage.setItem(key, json ? JSON.stringify(item) : item);
}

function getFromSessionStorage(key, json) {
  var data = sessionStorage.getItem(key);
  if (json) return JSON.parse(data);

  return data;
}

function getUsers() {
  return getFromSessionStorage('codename.users', true).users;
}

function getUsername() {
  return getFromSessionStorage('codename.username', false);
}

function saveUsers(users) {
  saveToSessionStorage('codename.users', { users: users }, true);
}

function saveUsername(username) {
  saveToSessionStorage('codename.username', username, false);
}

$(function() {
  var socket = io();
  function sendMessage() {
    if (!$('#m').val().trim()) {
      alert('You cannot send an empty message.');
      return false;
    }

    socket.emit('message', JSON.stringify({
      username: $('#username').val(),
      message: $('#m').val(),
    }));
    $('#m').val('');

    return false;
  }

  $("#m").keydown(function (event) {
    if ((event.metaKey || event.ctrlKey) && event.keyCode == 13)
      sendMessage();
  });

  $('#username-form').submit(function() {
    var uname = $('#username').val().trim();
    if (!uname) {
      alert('Please input a username.');
      return false;
    }

    socket.emit('check-username', JSON.stringify({ name: uname }));

    return false;
  });

  $('#message-bay').submit(function() {
    return sendMessage();
  });

  socket.on('username-validation', function(response) {
    var data = JSON.parse(response);
    if (data.exists) alert('The usename ' + data.username + ' already exists.');
    else {
      $('#username-container').hide();
      saveUsername(data.username);
      socket.emit('user-join', data.username);
    }
  });

  socket.on('user-join', function(name) {
    if (getUsername() === name) return;

    var data = getUsers();
    data.push(name);
    saveUsers(data);
    alert(name + ' has joined!');
  });

  socket.on('user-disconnect', function(name) {
    var users = getUsers();
    users.splice(users.indexOf(name), 1);
    saveUsers(users);
    alert(name + ' has left!');
  });

  socket.on('messages', function(response) {
    var data = JSON.parse(response);
    saveUsers(data.users || []);
    data.messages.map(function(message) {
        $('#messages')
          .append($('<li>')
          .text(message.username + ':' + message.message));
    });
    scrollToBottom();
  });

  socket.on('message', function(response) {
    var data = JSON.parse(response);
    $('#messages').append($('<li>').text(data.username + ':' + data.message));
    scrollToBottom();
  });
});
