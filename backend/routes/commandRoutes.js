const express = require("express");
const router = express.Router();
const { processCommand } = require("../controllers/commandController");

router.post("/", processCommand);

module.exports = router;
