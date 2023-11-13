const chats = require("../models/Chat");

exports.retrieveChats = async (req, res) => {
  const { user_id } = req.params;
  
  try {
    const chats = await Chat.findAll({
      where: {
       user_id: user_id
      }
    });
 
    res.status(200).json(chats);
  } catch (err) {
   res.status(500).json({ message: err.message });
  }
};

// exports.byDate = async function (req, res) {
//   console.log(req.body);
//   const usersToday = await chats.getChatsByDay(req.body.date);
//   console.log(usersToday);
//   res.status(200).json(usersToday);
// };


// exports.index = async function (req, res) {
//   const total = await chats.getTodaysChats();
//   res.json(total);
// };