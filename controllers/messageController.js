const ChatRoom = require('../models/ChatRoom');
const User = require('../models/User');
const Message = require('../models/Message');
let io;

const initialize = (socketIo) => {
    io = socketIo;
};

const sendMessage = async (req, res) => {
    const { chatRoomId, message } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findOne({ where: { id: userId } });
        const chatRoom = await ChatRoom.findOne({ where: { id: chatRoomId } });

        if (!chatRoom) {
            return res.status(404).json({ message: 'Chat room not found' });
        }

        const newMessage = await Message.create({
            chatRoomId,
            userId: user.id,
            message
        });

        io.to(chatRoomId).emit('newMessage', `${user.username}: ${message}`);

        res.status(201).json({ message: 'Message sent', newMessage });
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error });
    }
};

const getMessages = async (req, res) => {
    const { chatRoomId } = req.params;

    try {
        const messages = await Message.findAll({ where: { chatRoomId } });

        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ message: 'Error retrievingmessages', error });
}
};

module.exports = {
initialize,
sendMessage,
getMessages
};
