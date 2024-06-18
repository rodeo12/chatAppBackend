const ChatRoom = require("../models/ChatRoom");
const User = require('../models/User');

// Create a new chat room
exports.createChatRoom = async (req, res) => {
    const { roomName, password } = req.body;
    const userId = req.user.userId;

    try {
        console.log("Chat Room")
        const chatRoom = await ChatRoom.create({
            roomId: Math.random().toString(36).substr(2, 9), // Generate a unique roomId
            roomName,
            password,
            createdBy: userId
        });

        res.status(201).json({ message: 'Chat room created successfully', chatRoom });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create chat room', error });
    }
};

// Join a chat room
exports.joinChatRoom = async (req, res) => {
    const { roomId, password } = req.body;
    const userId = req.user.id;

    try {
        const chatRoom = await ChatRoom.findOne({ where: { roomId } });

        if (!chatRoom) {
            return res.status(404).json({ message: 'Chat room not found' });
        }

        if (chatRoom.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const user = await User.findOne({ where: { id: userId } });

        if (user.isPrimeMember || !user.hasUsedFreeRoom) {
            if (chatRoom.members.includes(userId)) {
                return res.status(400).json({ message: 'User already in chat room' });
            }

            if (chatRoom.members.length >= chatRoom.maxCapacity) {
                return res.status(400).json({ message: 'Chat room is full' });
            }

            chatRoom.members.push(userId);
            await chatRoom.save();


            if (!user.isPrimeMember) {
                user.hasUsedFreeRoom = true;
                await user.save();
            }

            res.status(200).json({ message: 'Joined chat room successfully', chatRoom });
        } else {
            return res.status(400).json({ message: 'Non-prime members must pay 150 coins to join additional rooms' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to join chat room', error });
    }
};

// Invite participants to a chat room
exports.inviteParticipants = async (req, res) => {
    const { roomId, inviteeId } = req.body;
    const userId = req.user.id;

    try {
        const chatRoom = await ChatRoom.findOne({ where: { roomId } });

        if (!chatRoom) {
            return res.status(404).json({ message: 'Chat room not found' });
        }

        if (chatRoom.createdBy !== userId) {
            return res.status(403).json({ message: 'Only the creator can invite participants' });
        }

        const invitee = await User.findOne({ where: { id: inviteeId } });

        if (!invitee) {
            return res.status(404).json({ message: 'Invitee not found' });
        }

        if (chatRoom.members.includes(inviteeId)) {
            return res.status(400).json({ message: 'Invitee already in chat room' });
        }

        if (chatRoom.members.length >= chatRoom.maxCapacity) {
            return res.status(400).json({ message: 'Chat room is full' });
        }

        chatRoom.members.push(inviteeId);
        await chatRoom.save();

        res.status(200).json({ message: 'Invitee added to chat room successfully', chatRoom });
    } catch (error) {
        res.status(500).json({ message: 'Failed to invite participant', error });
    }
};
