const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');

// Send a friend request
exports.sendFriendRequest = async (req, res) => {
    const { receiverUserId } = req.body;
    const senderUserId = req.user.id;

    try {
        // Check if the receiver user exists
        const receiverUser = await User.findOne({ where: { userId: receiverUserId } });
        if (!receiverUser) {
            return res.status(404).json({ message: 'Receiver user not found' });
        }

        // Check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({
            where: { senderId: senderUserId, receiverId: receiverUser.id }
        });
        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }

        // Create a new friend request
        const friendRequest = await FriendRequest.create({
            senderId: senderUserId,
            receiverId: receiverUser.id,
            status: 'Pending'
        });

        res.status(201).json({ message: 'Friend request sent', friendRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error sending friend request', error });
    }
};

// Accept a friend request
exports.acceptFriendRequest = async (req, res) => {
    const { requestId } = req.body;
    const receiverUserId = req.user.id;

    try {
        // Find the friend request
        const friendRequest = await FriendRequest.findOne({
            where: { id: requestId, receiverId: receiverUserId }
        });
        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        // Update the friend request status to Accepted
        friendRequest.status = 'Accepted';
        await friendRequest.save();

        res.status(200).json({ message: 'Friend request accepted', friendRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting friend request', error });
    }
};

// Decline a friend request
exports.declineFriendRequest = async (req, res) => {
    const { requestId } = req.body;
    const receiverUserId = req.user.id;

    try {
        // Find the friend request
        const friendRequest = await FriendRequest.findOne({
            where: { id: requestId, receiverId: receiverUserId }
        });
        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        // Update the friend request status to Declined
        friendRequest.status = 'Declined';
        await friendRequest.save();

        res.status(200).json({ message: 'Friend request declined', friendRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error declining friend request', error });
    }
};

// Get friend requests for the logged-in user
exports.getFriendRequests = async (req, res) => {
    const userId = req.user.id;

    try {
        // Find friend requests sent to the user
        const receivedRequests = await FriendRequest.findAll({
            where: { receiverId: userId, status: 'Pending' },
            include: [{ model: User, as: 'sender', attributes: ['userId', 'fullName'] }]
        });

        res.status(200).json({ receivedRequests });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching friend requests', error });
    }
};
