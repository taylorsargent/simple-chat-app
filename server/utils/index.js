/* eslint-disable */
module.exports = {
  error: (port, error) => {
    if (error.syscall !== 'listen') throw error;

    const bind = typeof port === 'string'
      ? `Pipe ${port}`
      : `Port ${port}`;

    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  },
  normalizePort: val => {
    const port = parseInt(val);
    if (isNaN(port)) return val;
    if (port >= 0) return port;

    return false;
  },
  listening: server => {
    const addr = server.address();
    console.log(`Listening on ${addr.address}:${addr.port}`);
  }
}
