const express = require("express");
const router = express.Router();

const {
  getSubjectResources,
  getSubjectSyllabus,
  getSubjectMaterials,
  getSubjectImportantTopics,
  getSubjectVideos,
  getSubjectPracticals,
  getSubjectLearningProcess
} = require("../controllers/resourceController");

router.get("/subjects/:subjectId/resources", getSubjectResources);
router.get("/subjects/:subjectId/syllabus", getSubjectSyllabus);
router.get("/subjects/:subjectId/materials", getSubjectMaterials);
router.get("/subjects/:subjectId/important-topics", getSubjectImportantTopics);
router.get("/subjects/:subjectId/videos", getSubjectVideos);
router.get("/subjects/:subjectId/practicals", getSubjectPracticals);
router.get("/subjects/:subjectId/learning-process", getSubjectLearningProcess);

module.exports = router;
