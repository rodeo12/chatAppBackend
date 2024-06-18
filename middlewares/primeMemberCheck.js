const  User  = require('../models/User');

const primeMemberCheck = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isPrimeMember) {
            return res.status(403).json({ message: 'You must be a prime member to perform this action' });
        }

        next();
    } catch (error) {
        console.error('Error checking prime member status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = primeMemberCheck;
