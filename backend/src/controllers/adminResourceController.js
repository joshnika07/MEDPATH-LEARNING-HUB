const courseModel = require("../models/courseModel");

async function addSubjectResources(req, res) {
  const { subjectId } = req.params;
  try {
    const subjectExists = await courseModel.checkSubjectExists(subjectId);
    if (!subjectExists) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    const resourcesExist = await courseModel.checkSubjectResourcesExist(subjectId);
    if (resourcesExist) {
      return res.status(400).json({
        success: false,
        message: "Resources already exist for this subject. Use PUT to update."
      });
    }

    const success = await courseModel.addSubjectResources(subjectId, req.body);
    if (success) {
      return res.status(201).json({
        success: true,
        message: "Resources added successfully"
      });
    }
    
    throw new Error("Failed to insert subject resources");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function updateSubjectResources(req, res) {
  const { subjectId } = req.params;
  try {
    const subjectExists = await courseModel.checkSubjectExists(subjectId);
    if (!subjectExists) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    const resourcesExist = await courseModel.checkSubjectResourcesExist(subjectId);
    if (!resourcesExist) {
      return res.status(404).json({
        success: false,
        message: "Resources not found for this subject. Use POST to create."
      });
    }

    const success = await courseModel.updateSubjectResources(subjectId, req.body);
    if (success) {
      return res.json({
        success: true,
        message: "Resources updated successfully"
      });
    }

    throw new Error("Failed to update subject resources");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function deleteSubjectResources(req, res) {
  const { subjectId } = req.params;
  try {
    const subjectExists = await courseModel.checkSubjectExists(subjectId);
    if (!subjectExists) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    const resourcesExist = await courseModel.checkSubjectResourcesExist(subjectId);
    if (!resourcesExist) {
      return res.status(404).json({
        success: false,
        message: "Resources not found for this subject."
      });
    }

    const success = await courseModel.deleteSubjectResources(subjectId);
    if (success) {
      return res.json({
        success: true,
        message: "Resources deleted successfully"
      });
    }

    throw new Error("Failed to delete subject resources");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  addSubjectResources,
  updateSubjectResources,
  deleteSubjectResources
};
