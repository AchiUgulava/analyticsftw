
// models/Message.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Message = sequelize.define('Message', {
        message_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        chat_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        message_content: {
          type: DataTypes.STRING,
          allowNull: false
        },
        timestamp: {
          type: DataTypes.DATE,
          allowNull: false
        },
        sender: {
          type: DataTypes.STRING,
          allowNull: false
        },
        like_coefficient: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        seq_num: {
          type: DataTypes.INTEGER,
          allowNull: false
        }
      }, {
        sequelize,
        modelName: 'Message',
        tableName: 'messages',
        timestamps: false
      });
  
    return Message;
  };
  
