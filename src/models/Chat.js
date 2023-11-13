
// models/Chat.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Chat = sequelize.define('Chat', {
    chat_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    chat_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    last_accessed: {
      type: DataTypes.DATE,
      allowNull: true
    },
    total_conversation_duration: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
   }, {
    sequelize,
    modelName: 'Chat',
    tableName: 'chats',
    timestamps: false
   });

  return Chat;
};
