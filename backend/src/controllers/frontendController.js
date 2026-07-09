const courseModel = require("../models/courseModel");
const { getAllCourses } = require("../data/courseData");

async function getFrontendCourseTree(req, res) {
  try {
    const tree = await courseModel.getCourseTree();
    if (tree && tree.length > 0) {
      return res.status(200).json({
        success: true,
        data: tree
      });
    }
  } catch (error) {
    console.error("Database query failed for getFrontendCourseTree, using mock data:", error.message);
  }

  // Static mock data fallback
  try {
    const tree = getAllCourses();
    res.status(200).json({
      success: true,
      data: tree
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  getFrontendCourseTree
};
