/* eslint-disable no-magic-numbers */
'use strict';

const fs = require('fs');
const path = require('path');
const moment = require('moment');

module.exports = class ChatManager {
  constructor(io) {
    this.users = [];
    this.messages = [];
    this.io = io;

    io.on('connection', socket => {
      socket.emit('messages', JSON.stringify({
        users: this.users.map(u => u.username),
        messages: this.messages,
      }));

      socket.on('get-template', name =>
        socket.emit(`send-template-${name}`, JSON.stringify({
          name: name,
          template: fs.readFileSync(
          path.join(__dirname, '..', '..', 'templates', `${name}.html`)).toString(),
        })));

      socket.on('disconnect', () => {
        const users = this.users.filter(u => u.socket === socket);

        if (users.length > 0) {
          io.emit('user-disconnect', users[0].username);
          this.deleteUser(users[0]);
        }
      });

      socket.on('check-username', response => {
        const data = JSON.parse(response);
        socket.emit('username-validation', JSON.stringify({
          exists: this.hasUsername(data.name),
          username: data.name,
        }));
      });

      socket.on('user-join', name => {
        console.log(name);
        this.users.push({
          username: name,
          socket: socket,
        });
        io.emit('user-join', name);
      });

      socket.on('message', response => {
        const data = JSON.parse(response);
        data.timestamp = moment().valueOf();
        this.messages.push(data);
        io.emit('message', JSON.stringify(data));
      });
    });

    setInterval(() => {
      if (this.messages.length > 10000)
        this.messages = [];
    }, moment.duration(2, 'hours').asMilliseconds());
  }

  deleteUser(user) {
    this.users.splice(this.users.indexOf(user), 1);
  }

  hasUsername(name) {
    return this.users.map(u => u.username).indexOf(name) > -1;
  }
};
