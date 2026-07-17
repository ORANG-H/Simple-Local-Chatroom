import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const port = 3001;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('send_message', (message) => {
    io.emit('receive_message', message);
  });

  socket.on('typing_started', ({ sender }) => {
    socket.broadcast.emit('typing_started', { sender });
  });

  socket.on('typing_stopped', ({ sender }) => {
    socket.broadcast.emit('typing_stopped', { sender });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

httpServer.listen(port, '0.0.0.0', () => {
  console.log(`Socket server listening on port ${port}`);
});
