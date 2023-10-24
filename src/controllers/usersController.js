const users = require("../models/users.js");

exports.index = async function (req, res) {
  const total = await users.getAllUsers();

  res.json(total);
};

exports.userCount = async function (req, res) {
  const count = await users.getUserCount();
  console.log(count);
  res.status(200).json(count);
};

exports.todaysCount = async function (req, res) {
  const countToday = await users.getTodaysCount();
  console.log(countToday);
  res.status(200).json(countToday);
};
exports.byDate = async function (req, res) {
  console.log(req.body);
  const usersToday = await users.getUsersByDay(req.body.date);
  console.log(usersToday);
  res.status(200).json(usersToday);
};


exports.getFilteredUsers = async function (req, res) {
  console.log(req.body);
  const filteredUsers = await users.getFilteredUsers(req.body.sortby,req.body.page);
  console.log(filteredUsers);
  res.status(200).json(filteredUsers);
};
