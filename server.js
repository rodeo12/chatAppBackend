const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const { sequelize } = require('./utils/db');
const authRoutes = require('./routes/authRoutes');
const chatRoomRoutes = require('./routes/chatRoomRoutes');
const friendRequestRoutes = require('./routes/friendRequestRoutes');
const messageRoutes = require('./routes/messageRoutes');
const profileRoutes = require('./routes/profileRoutes');
const errorHandlingMiddleware = require('./middlewares/errorHandlingMiddleware');
const { initialize } = require('./controllers/messageController');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chatrooms', chatRoomRoutes);
app.use('/api/friend-requests', friendRequestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/profile', profileRoutes);

// Socket.io setup
// io.on('connection', (socket) => {
//     console.log('Socket connected:');

//     // socket.on('joinRoom', ({ roomId, username }) => {
//     //     socket.join(roomId);
//     //     console.log(`${username} joined room: ${roomId}`);
//     // });

//     // socket.on('chatMessage', ({ roomId, message }) => {
//     //     io.to(roomId).emit('message', message);
//     // });

//     socket.on('disconnect', () => {
//         console.log('Socket disconnected:', socket.id);
//     });
// });


// Middleware to check authentication for socket connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
      // Here you should verify the token and extract the user data
      // For example: jwt.verify(token, 'your_jwt_secret', (err, user) => {...})
      next();
  } else {
      next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', (chatRoomId) => {
      socket.join(chatRoomId);
      // Send room info to the client
      ChatRoom.findOne({ where: { id: chatRoomId } }).then((chatRoom) => {
          if (chatRoom) {
              socket.emit('roomInfo', {
                  roomName: chatRoom.roomName,
                  createdBy: chatRoom.createdBy,
                  members: chatRoom.members,
                  maxCapacity: chatRoom.maxCapacity
              });
          }
      });
  });

  socket.on('getRoomInfo', async (chatRoomId) => {
      const chatRoom = await ChatRoom.findOne({ where: { id: chatRoomId } });
      if (chatRoom) {
          socket.emit('roomInfo', {
              roomName: chatRoom.roomName,
              createdBy: chatRoom.createdBy,
              members: chatRoom.members,
              maxCapacity: chatRoom.maxCapacity
          });
      }
  });

  socket.on('sendMessage', (data) => {
      const { chatRoomId, message } = data;
      const userId = socket.user.id; // Assuming you have set this in the authentication step
      // Save the message and emit to the room
      Message.create({ chatRoomId, userId, message }).then((newMessage) => {
          io.to(chatRoomId).emit('newMessage', `${socket.user.username}: ${message}`);
      });
  });

  socket.on('disconnect', () => {
      console.log('Client disconnected');
  });
});

initialize(io);

// Error handling middleware
app.use(errorHandlingMiddleware);

// Start the server
const PORT = process.env.PORT || 3000;

// Connect to the database and sync
sequelize
    .authenticate()
    .then(() => {
        console.log('Database connected');
        return sequelize.sync();
    })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });


