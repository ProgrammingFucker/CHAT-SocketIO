const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

let users = [];

app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
  console.log(`Usuario conectado: ${socket.id}`);

  socket.on('join', username => {
    console.log(`${username} se ha unido al chat.`);
    users.push({ id: socket.id, name: username });
    io.emit('users', users.map(user => user.name));
  });

  socket.on('message', message => {
    console.log(`Mensaje recibido: ${JSON.stringify(message)}`);
    const recipientSocket = users.find(user => user.name === message.recipient)?.id;
    if (recipientSocket) {
      io.to(recipientSocket).emit('message', message);
    } else {
      console.log(`El destinatario ${message.recipient} no está conectado.`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);
    users = users.filter(user => user.id !== socket.id);
    io.emit('users', users.map(user => user.name));
  });
});

http.listen(PORT, () => {
  console.log(`Servidor Socket.IO escuchando en el puerto ${PORT}`);
});
