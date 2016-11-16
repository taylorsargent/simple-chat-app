'use strict';

const Io            = require('socket.io');
const http          = require('http').Server;
const utils         = require('./server/utils');
const server        = http(require('./server'));
const io            = Io(server);
const ChatManager   = require('./server/chat');

new ChatManager(io);

// eslint-disable-next-line no-magic-numbers
const port = utils.normalizePort(process.env.PORT || 3000);

if (process.env.NODE_ENV === 'development') server.listen(port);
else server.listen(port, process.env.ADDR);

server.on('error', error => utils.error(port, error));
server.on('listening', () => utils.listening(server));
