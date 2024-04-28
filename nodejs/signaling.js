"use strict";

const WebSocketServer = require('ws').Server;
const port = 3001;
const wsServer = new WebSocketServer({port});
console.log('websocket server start. port=' + port);

wsServer.on('connection', ws => {
  console.log('-- websocket connected --');
  ws.on('message', message => {
    wsServer.clients.forEach(client => {
      if (ws !== client) {
        client.send(message.toString());
      }
    });
  });
});
