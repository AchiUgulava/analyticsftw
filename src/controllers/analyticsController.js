const analytics = require("../models/analytics");

exports.index = async function (req, res) {
  res.json("total");
};

exports.setByDate = async function (req, res) {
  console.log(req.body);
  const todaysAnalytics = await analytics.setAnalytics(req.body.date);

  res.status(200).json(todaysAnalytics);
};

exports.setToday = async function (req, res) {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  let yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;
  const todaysAnalytics = await analytics.setAnalytics(today);
  res.status(200).json(todaysAnalytics);
};

exports.getWeekly = async function (req, res) {
  const weeklyAnalytics = await analytics.getWeekly();
  res.status(200).json(weeklyAnalytics);
};
