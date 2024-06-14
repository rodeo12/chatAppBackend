const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected route to send a message
router.post('/send', authMiddleware, sendMessage);

module.exports = router;
