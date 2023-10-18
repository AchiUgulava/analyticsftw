const express = require("express");
const controller =require('../controllers/analyticsController');
const router = express.Router();

router.get("/", controller.index);

router.post("/data", controller.byDate);

module.exports = router;
