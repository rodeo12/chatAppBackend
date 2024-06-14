const { DataTypes } = require('sequelize');
const {sequelize} = require('../utils/db');
const User = require('./User'); // Assuming User model is imported

const FriendRequest = sequelize.define('FriendRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Accepted', 'Declined'),
    defaultValue: 'Pending',
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

FriendRequest.associate = (models) => {
  FriendRequest.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
  FriendRequest.belongsTo(models.User, { foreignKey: 'receiverId', as: 'receiver' });
};

module.exports = FriendRequest;
