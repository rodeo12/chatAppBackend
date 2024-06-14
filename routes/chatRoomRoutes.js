const express = require('express');
const router = express.Router();
const chatRoomController = require('../controllers/chatRoomController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create', authMiddleware, chatRoomController.createChatRoom);
// Invite a participant to a chat room
router.post('/invite',authMiddleware, chatRoomController.inviteParticipant);

module.exports = router;
