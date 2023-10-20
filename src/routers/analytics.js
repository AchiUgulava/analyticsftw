const express = require("express");
const controller = require("../controllers/analyticsController");
const router = express.Router();

router.get("/", controller.index);

router.post("/setByDate", controller.setByDate);
router.post("/setToday", controller.setToday);
router.post("/getWeekly", controller.getWeekly);

module.exports = router;
