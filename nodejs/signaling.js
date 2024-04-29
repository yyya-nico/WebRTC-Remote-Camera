"use strict";

const fs = require('fs');
const https = require('https');
const WebSocketServer = require('ws').Server;

const server = https.createServer({
  cert: fs.readFileSync('./test.crt'),
  ca: fs.readFileSync('./ca.crt'),
  key: fs.readFileSync('./test.key')
});

const port = 3001;
const wsServer = new WebSocketServer({server});
console.log('WebSocket server started. port:' + port);

wsServer.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log('connect from ' + ip);
  ws.on('message', message => {
    console.log('from ' + ip + ' sent type:', JSON.parse(message.toString()).type);
    wsServer.clients.forEach(client => {
      if (ws !== client) {
        client.send(message.toString());
      }
    });
  });
});

server.listen(port);
