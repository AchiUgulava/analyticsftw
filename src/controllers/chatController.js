const chats = require('../models/chats.js') 



exports.index = async function (req, res) {
  const total = await chats.getTodaysChats();
  res.json(total);
  
};

exports.byDate = async function (req, res) {
    console.log(req.body)
      const usersToday = await chats.getChatsByDay(req.body.date);
      console.log(usersToday)
      res.status(200).json(usersToday);
    
    };