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
console.log('websocket server start. port=' + port);

wsServer.on('connection', ws => {
  console.log('-- websocket connected --');
  ws.on('message', message => {
    wsServer.clients.forEach(client => {
      if (ws !== client) {
        client.send(message.toString());
      }
    });
    console.log('message relayed:', message.toString());
  });
});

server.listen(port);
