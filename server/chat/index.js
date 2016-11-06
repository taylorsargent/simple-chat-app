/* eslint-disable no-magic-numbers */
'use strict';

const moment = require('moment');

module.exports = class ChatManager {
  constructor(io) {
    this.users = [];
    this.messages = [];
    this.io = io;

    io.on('connection', socket => {
      socket.emit('messages', {
        users: this.users,
        messages: this.messages,
      });

      socket.on('user-join', name => {
        this.users.push({
          username: name,
          socket: socket,
        });
        io.emit('user-join', name);
      });

      socket.on('message', data => {
        data.timestamp = moment().valueOf();
        this.messages.push(data);
        io.emit('message', data);
      });
    });

    setInterval(() => {
      if (this.messages.length > 10000)
        this.messages = [];
    }, moment.duration(2, 'hours').asMilliseconds());
  }

  deleteUser(name) {
    this.users.splice(this.users.indexOf(name), 1);
  }
};
