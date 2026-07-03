const express = require("express");

const {
  getCourses,
  getCourse,
  getSemesters,
  getSubjectsBySemester,
  getSubjectsByCourse
} = require("../controllers/courseController");

const router = express.Router();

router.get("/", getCourses);
router.get("/:courseId", getCourse);
router.get("/:courseId/semesters", getSemesters);
router.get("/:courseId/subjects", getSubjectsByCourse);
router.get("/:courseId/semesters/:semesterId/subjects", getSubjectsBySemester);

module.exports = router;
