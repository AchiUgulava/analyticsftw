// models/User.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    modelName: 'User',
    tableName: 'users',
    timestamps: false
  });

  return User;
};
