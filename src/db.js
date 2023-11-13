// db.js
require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
 host: process.env.DB_HOST,
 dialect: 'mysql',
 logging: console.log
});

 const User = require('./models/User')(sequelize);
 const Chat = require('./models/Chat')(sequelize);
 const Message = require('./models/Message')(sequelize);

sequelize.authenticate()
 .then(() => console.log('Connected to the database!'))
 .catch(err => console.error('Unable to connect to the database: ', err));
 
 // Define associations
 User.hasMany(Chat, {
   foreignKey: 'user_id',
   as: 'Chats'
 });
 
 Chat.belongsTo(User, {
   foreignKey: 'user_id',
   as: 'User'
 });
 
 Chat.hasMany(Message, {
   foreignKey: 'chat_id',
   as: 'Messages'
 });
 
 Message.belongsTo(Chat, {
   foreignKey: 'chat_id',
   as: 'Chat'
 });
 
 module.exports = {
   sequelize,
   User,
   Chat,
   Message
 };
