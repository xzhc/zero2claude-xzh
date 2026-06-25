const TicTacToeGame = require('./game.js');

const waitingQueue = [];
const activeGames = new Map();
const socketRooms = new Map();

function generateRoomId() {
  return Math.random().toString(36).slice(2, 8);
}

function addToQueue(socket, io) {
  if (waitingQueue.length > 0) {
    const opponent = waitingQueue.shift();

    const roomId = generateRoomId();
    const game = new TicTacToeGame();

    const players = [socket, opponent];
    const symbols = ['X', 'O'];
    // Randomly assign X and O
    if (Math.random() < 0.5) {
      symbols.reverse();
    }

    players.forEach((playerSocket, i) => {
      playerSocket.join(roomId);
      socketRooms.set(playerSocket.id, roomId);
      io.to(playerSocket.id).emit('game-start', {
        symbol: symbols[i],
        roomId,
      });
    });

    activeGames.set(roomId, { game, players });
  } else {
    waitingQueue.push(socket);
    socket.emit('waiting');
  }
}

function removeFromQueue(socket) {
  const index = waitingQueue.indexOf(socket);
  if (index !== -1) {
    waitingQueue.splice(index, 1);
  }
}

function handleDisconnect(socket, io) {
  const roomId = socketRooms.get(socket.id);

  if (roomId) {
    const session = activeGames.get(roomId);
    if (session) {
      const opponent = session.players.find(s => s.id !== socket.id);
      if (opponent) {
        opponent.emit('opponent-left');
      }
      activeGames.delete(roomId);
    }
    socketRooms.delete(socket.id);
  } else {
    removeFromQueue(socket);
  }
}

module.exports = { addToQueue, removeFromQueue, handleDisconnect, socketRooms, activeGames };
