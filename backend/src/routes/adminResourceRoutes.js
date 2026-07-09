const express = require("express");
const router = express.Router();

const {
  addSubjectResources,
  updateSubjectResources,
  deleteSubjectResources
} = require("../controllers/adminResourceController");

router.post("/subjects/:subjectId/resources", addSubjectResources);
router.put("/subjects/:subjectId/resources", updateSubjectResources);
router.delete("/subjects/:subjectId/resources", deleteSubjectResources);

module.exports = router;
