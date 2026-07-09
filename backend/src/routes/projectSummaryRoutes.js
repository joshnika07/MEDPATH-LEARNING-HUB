const express = require("express");
const { getProjectSummary } = require("../controllers/projectSummaryController");

const router = express.Router();

router.get("/project/summary", getProjectSummary);

module.exports = router;
