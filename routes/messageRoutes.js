const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected route to send a message
router.post('/send', authMiddleware, sendMessage);

// Route to get messages for a specific chat room
router.get('/:chatRoomId', authMiddleware, getMessages);

module.exports = router;

