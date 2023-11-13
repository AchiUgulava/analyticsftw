const express = require("express");
const controller = require("../controllers/usersController");
const router = express.Router();
router.post("/getByEmail", controller.getByEmail);
router.post("/count", controller.userCount);
router.post("/getSorted", controller.getSortedUsers)
router.post("/getFilteredAndSorted",controller.getSortedAndFilteredUsers)
// router.get("/countToday", controller.todaysCount);
// router.post("/byDate", controller.byDate);
router.get("/data", (req, res) => {
  res.send("Here is some analytics data");
});

module.exports = router;
