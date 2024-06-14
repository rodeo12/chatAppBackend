// chatRoomController.js

const ChatRoom = require('../models/ChatRoom');
const User = require('../models/User');
const { io } = require('../server'); // Import Socket.IO instance

exports.createChatRoom = async (req, res) => {
    const { roomId, roomName } = req.body;
    const userId = req.user.userId;

    try {
        const user = await User.findOne({ where: { userId } });
        if (!user.isPrimeMember) {
            return res.status(403).json({ message: 'Only prime members can create chat rooms' });
        }

        const existingRoom = await ChatRoom.findOne({ where: { roomId } });
        if (existingRoom) {
            return res.status(400).json({ message: 'Room ID already taken' });
        }

        const chatRoom = await ChatRoom.create({
            roomId,
            roomName,
            createdBy: userId,
            members: [userId]
        });

        // Emit a socket event to notify clients about the new chat room
        // io.emit('newChatRoom', chatRoom);

        res.status(201).json({ message: 'Chat room created successfully', chatRoom });
    } catch (error) {
        // res.status(500).json({ message: 'Error creating chat room', error });
        console.log(error.message);
    }
};

exports.inviteParticipant = async (req, res) => {
    const { roomId, inviteeUserId } = req.body;
    const userId = req.user.userId;

    try {
        const chatRoom = await ChatRoom.findOne({ where: { roomId } });
        if (!chatRoom) {
            return res.status(404).json({ message: 'Chat room not found' });
        }

        if (chatRoom.createdBy !== userId) {
            return res.status(403).json({ message: 'Only the chat room creator can invite participants' });
        }

        if (chatRoom.members.length >= chatRoom.maxCapacity) {
            return res.status(400).json({ message: 'Chat room has reached its maximum capacity' });
        }

        const invitee = await User.findOne({ where: { userId: inviteeUserId } });
        if (!invitee.isPrimeMember) {
            return res.status(400).json({ message: 'Invitee must be a prime member' });
        }

        chatRoom.members.push(inviteeUserId);
        await chatRoom.save();

        // Emit a socket event to notify clients about the updated chat room
        // io.emit('inviteParticipant', chatRoom);

        res.status(200).json({ message: 'Participant invited successfully', chatRoom });
    } catch (error) {
        console.log(error.message)
        // res.status(500).json({ message: 'Error inviting participant', error });
    }
};
