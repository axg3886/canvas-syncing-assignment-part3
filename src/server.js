const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);
const io = socketio(app);

console.log(`Listening on 127.0.0.1: ${port}`);

const draws = {};

io.sockets.on('connection', (socket) => {
  // Once connected, bring up to speed.
  socket.emit('setup', draws);

  // Catch draw messages
  socket.on('draw', (data) => {
    // Update global draw list
    draws[data.name] = data.coords;
    // Resend it to everyone
    // This includes itself as if server 'validation'
    io.emit('update', data);
  });
});
