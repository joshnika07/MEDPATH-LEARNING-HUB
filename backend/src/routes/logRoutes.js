const express = require("express");
const router = express.Router();
const { getRequestLogs, getAdminActivityLogs } = require("../controllers/logController");

router.get("/logs/requests", getRequestLogs);
router.get("/logs/activities", getAdminActivityLogs);

module.exports = router;
