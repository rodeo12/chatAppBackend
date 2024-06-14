const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to get user profile
router.get('/:userId', authMiddleware, getUserProfile);

// Route to update user profile
router.put('/', authMiddleware, updateUserProfile);

module.exports = router;
