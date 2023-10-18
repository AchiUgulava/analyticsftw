const analytics = require("../models/analytics")


exports.index = async function (req, res) {
  res.json("total");
}

exports.byDate = async function (req, res) {
  console.log(req.body)
    const today = await analytics.getChatsAnalytics(req.body.date);
    const users = await analytics.getUserAnalytics(req.body.date);
    console.log("ananlytics",today,users)
    res.status(200).json(today);
  
  };