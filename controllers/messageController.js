let io;

const initialize = (socketIo) => {
    io = socketIo;
};

const ChatRoom = require('../models/ChatRoom');
const User = require('../models/User');
const Message = require('../models/Message');

const sendMessage = async (req, res) => {
    const { chatRoomId, message } = req.body;
    const userId = req.user.userId;

    try {
        const user = await User.findOne({ where: { userId } });
        const chatRoom = await ChatRoom.findOne({ where: { id: chatRoomId } });

        if (!chatRoom) {
            return res.status(404).json({ message: 'Chat room not found' });
        }

        const newMessage = await Message.create({
            chatRoomId,
            userId: user.id,
            message
        });

        io.to(chatRoomId).emit('newMessage', newMessage);

        res.status(201).json({ message: 'Message sent', newMessage });
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error });
    }
};

module.exports = {
    initialize,
    sendMessage
};
