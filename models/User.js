const { DataTypes } = require('sequelize');
const {sequelize} = require('../utils/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  deviceId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [10, 255],
        msg: "Full name must be at least 10 characters long",
      },
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  availCoins: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isPrimeMember: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
  updatedAt: 'updatedAt',
  createdAt: 'createdAt',
});

User.associate = (models) => {
  User.hasMany(models.ChatRoom, { foreignKey: 'creatorId', as: 'chatRooms' });
  User.hasMany(models.Message, { foreignKey: 'userId', as: 'messages' });
  User.hasMany(models.FriendRequest, { foreignKey: 'senderId', as: 'sentRequests' });
  User.hasMany(models.FriendRequest, { foreignKey: 'receiverId', as: 'receivedRequests' });
};

module.exports = User;
