const { Server } = require('socket.io');

let io;
let rooms = {}; // Store room data

module.exports = (req, res) => {
  if (!io) {
    const httpServer = res.socket.server;
    io = new Server(httpServer, {
      path: '/api/socket'
    });

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      socket.on('createRoom', (roomCode, playerName) => {
        if (rooms[roomCode]) {
          socket.emit('roomExists');
        } else {
          rooms[roomCode] = {
            players: [{ id: socket.id, name: playerName }],
            gameStarted: false
          };
          socket.join(roomCode);
          socket.emit('roomCreated', rooms[roomCode]);
          console.log(`Room ${roomCode} created by ${playerName}`);
        }
      });

      socket.on('joinRoom', (roomCode, playerName) => {
        const room = rooms[roomCode];
        if (!room) {
          socket.emit('roomNotFound');
        } else if (room.gameStarted) {
          socket.emit('gameInProgress');
        } else {
          room.players.push({ id: socket.id, name: playerName });
          socket.join(roomCode);
          io.to(roomCode).emit('updateRoom', room);
          console.log(`${playerName} joined room ${roomCode}`);
        }
      });

      socket.on('startGame', (roomCode) => {
        const room = rooms[roomCode];
        if (room) {
          room.gameStarted = true;
          io.to(roomCode).emit('gameStarted', room);
          console.log(`Game started in room ${roomCode}`);
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        for (const roomCode in rooms) {
          const room = rooms[roomCode];
          const playerIndex = room.players.findIndex(p => p.id === socket.id);
          if (playerIndex !== -1) {
            room.players.splice(playerIndex, 1);
            io.to(roomCode).emit('updateRoom', room);
            if (room.players.length === 0) {
              delete rooms[roomCode];
              console.log(`Room ${roomCode} deleted due to no players`);
            }
            break;
          }
        }
      });
    });
  }
  res.end();
};
