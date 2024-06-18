const express = require('express');
const router = express.Router();
const chatRoomController = require('../controllers/chatRoomController');
const authMiddleware = require('../middlewares/authMiddleware');
const primeMemberCheck = require('../middlewares/primeMemberCheck');
const checkRoomCapacity = require('../middlewares/checkRoomCapacity');

// Route to create a chat room
router.post('/create',
    authMiddleware, // Check if the user is authenticated
    primeMemberCheck, // Check if the user is a prime member
    chatRoomController.createChatRoom
);

// Route to join a chat room
router.post('/join',
    authMiddleware, // Check if the user is authenticated
    checkRoomCapacity, // Check if the chat room has reached its maximum capacity
    chatRoomController.joinChatRoom
);

// Route to invite participants to a chat room
router.post('/invite',
    authMiddleware, // Check if the user is authenticated
    chatRoomController.inviteParticipants
);

module.exports = router;
