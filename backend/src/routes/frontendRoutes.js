const express = require("express");
const { getFrontendCourseTree } = require("../controllers/frontendController");

const router = express.Router();

router.get("/course-tree", getFrontendCourseTree);

module.exports = router;
