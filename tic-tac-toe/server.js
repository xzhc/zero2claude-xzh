const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(express.static('public'));

const io = new Server(server);

const { addToQueue, handleDisconnect, socketRooms, activeGames } = require('./matchmaking.js');

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on('find-game', () => {
    addToQueue(socket, io);
  });

  socket.on('make-move', ({ index }) => {
    const roomId = socketRooms.get(socket.id);
    if (!roomId) return;

    const session = activeGames.get(roomId);
    if (!session) return;

    const result = session.game.makeMove(index);
    if (result.valid) {
      io.to(roomId).emit('move-made', { ...result, turn: session.game.currentPlayer });
    }

    if (result.winner || result.isDraw) {
      io.to(roomId).emit('game-over', {
        winner: result.winner,
        isDraw: result.isDraw,
        board: result.board,
      });
      activeGames.delete(roomId);
      session.players.forEach(s => socketRooms.delete(s.id));
    }
  });

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    handleDisconnect(socket, io);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
