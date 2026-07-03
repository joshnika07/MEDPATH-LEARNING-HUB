const express = require("express");

const {
  getSubjectDetails,
  searchSubjects,
  getAllSubjectsList
} = require("../controllers/courseController");

const router = express.Router();

router.get("/subjects", getAllSubjectsList);
router.get("/subjects/:subjectId", getSubjectDetails);
router.get("/search", searchSubjects);

module.exports = router;
