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
io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    // Add socket.io logic here
});

// Error handling middleware
app.use(errorHandlingMiddleware);

app.get("/",(req,res)=>{
    res.send("Welcome To Chat App Backend");
})

// Sync Sequelize models with the database
sequelize.sync({ alter: true }) // You can use { force: true } to force synchronization (drops existing tables)
    .then(() => {
        console.log('Database synchronized');
        // Start the server after syncing
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error synchronizing database:', error);
    });
