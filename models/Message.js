const { DataTypes } = require('sequelize');
const {sequelize} = require('../utils/db');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  chatRoomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  updatedAt: 'updatedAt',
  createdAt: 'createdAt',
});

Message.associate = (models) => {
  Message.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  Message.belongsTo(models.ChatRoom, { foreignKey: 'chatRoomId', as: 'chatRoom' });
};

module.exports = Message;
