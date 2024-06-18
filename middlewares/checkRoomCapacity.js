const ChatRoom  = require('../models/ChatRoom');

const checkRoomCapacity = async (req, res, next) => {
    try {
        const { roomId } = req.body;
        const chatRoom = await ChatRoom.findOne({ where: { roomId } });

        if (!chatRoom) {
            return res.status(404).json({ message: 'Chat room not found' });
        }

        const currentCapacity = chatRoom.members ? chatRoom.members.length : 0;
        if (currentCapacity >= chatRoom.maxCapacity) {
            return res.status(403).json({ message: 'Chat room has reached its maximum capacity' });
        }

        next();
    } catch (error) {
        console.error('Error checking room capacity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = checkRoomCapacity;
