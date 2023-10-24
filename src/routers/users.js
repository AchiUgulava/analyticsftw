const express = require("express");
const controller = require("../controllers/usersController");
const router = express.Router();
router.get("/", controller.index);
router.get("/count", controller.userCount);
router.get("/countToday", controller.todaysCount);
router.post("/byDate", controller.byDate);
router.post("/getFiltered", controller.getFilteredUsers)
router.get("/data", (req, res) => {
  res.send("Here is some analytics data");
});

module.exports = router;
