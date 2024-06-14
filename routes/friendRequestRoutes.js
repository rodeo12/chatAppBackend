const express = require('express');
const router = express.Router();
const friendRequestController = require('../controllers/friendRequestController');
const authMiddleware = require('../middlewares/authMiddleware');

// Send a friend request
router.post('/send', authMiddleware, friendRequestController.sendFriendRequest);

// Accept a friend request
router.post('/accept', authMiddleware, friendRequestController.acceptFriendRequest);

// Decline a friend request
router.post('/decline', authMiddleware, friendRequestController.declineFriendRequest);

// Get all friend requests
router.get('/', authMiddleware, friendRequestController.getFriendRequests);

module.exports = router;
