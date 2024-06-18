const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const ChatRoom = sequelize.define('ChatRoom', {
    roomId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    roomName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    members: {
        type: DataTypes.JSON, // Use JSON type for an array-like structure
        defaultValue: [], // Default value as an empty array
    },
    maxCapacity: {
        type: DataTypes.INTEGER,
        defaultValue: 6, // Default value for maxCapacity
    },
});

ChatRoom.associate = (models) => {
  ChatRoom.belongsTo(models.User, { foreignKey: 'creatorId', as: 'creator' });
  ChatRoom.hasMany(models.Message, { foreignKey: 'chatRoomId', as: 'messages' });
};

module.exports = ChatRoom;
