const express = require("express");
const controller = require("../controllers/chatController");
const router = express.Router();

// router.get("/", controller.index);
// router.post("/byDate", controller.byDate);

router.get("/data", (req, res) => {
  res.send("Here is some analytics data");
});

module.exports = router;
