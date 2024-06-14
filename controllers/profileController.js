//const User = require('../models/User');

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findOne({
            where: { userId },
            attributes: ['userId', 'fullName', 'phone', 'availCoins', 'isPrimeMember']
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.user; // Assuming userId is available in the request object after authentication
        const { fullName, phone } = req.body;

        const user = await User.findOne({ where: { userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.fullName = fullName || user.fullName;
        user.phone = phone || user.phone;

        await user.save();

        res.status(200).json({ message: 'User profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user profile', error });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile
};

