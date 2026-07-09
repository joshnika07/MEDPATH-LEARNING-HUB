const courseModel = require("../models/courseModel");
const { getSubjectById } = require("../data/courseData");
const buildSubjectResources = require("../utils/resourceTemplate");

function parseJsonField(field, fallback) {
  if (!field) return fallback;
  try {
    return JSON.parse(field);
  } catch (e) {
    if (typeof field === "string") {
      return field.split("\n").map(s => s.trim()).filter(Boolean);
    }
    return fallback;
  }
}

async function getResourcesForSubject(subjectId) {
  try {
    const result = await courseModel.getSubjectDetails(subjectId);
    if (result) {
      const { subject, resourcesRow } = result;
      let resources;
      if (resourcesRow) {
        resources = {
          syllabusUnits: parseJsonField(resourcesRow.syllabus_units, []),
          studyMaterials: parseJsonField(resourcesRow.study_materials, []),
          importantTopics: parseJsonField(resourcesRow.important_topics, []),
          videos: parseJsonField(resourcesRow.video_links, []),
          practicals: parseJsonField(resourcesRow.practicals, []),
          learningProcess: parseJsonField(resourcesRow.learning_process, [])
        };
      } else {
        resources = buildSubjectResources(subject);
      }
      return { subject, resources };
    }
  } catch (error) {
    console.error("Database query failed for getResourcesForSubject, using mock data:", error.message);
  }

  try {
    const subject = getSubjectById(subjectId);
    if (!subject) return null;

    return {
      subject,
      resources: buildSubjectResources(subject)
    };
  } catch (error) {
    return null;
  }
}

async function getSubjectResources(req, res) {
  try {
    const details = await getResourcesForSubject(req.params.subjectId);
    if (!details) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    res.json({
      success: true,
      data: details.resources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getSubjectSyllabus(req, res) {
  try {
    const details = await getResourcesForSubject(req.params.subjectId);
    if (!details) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    res.json({
      success: true,
      count: details.resources.syllabusUnits.length,
      data: details.resources.syllabusUnits
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getSubjectMaterials(req, res) {
  try {
    const details = await getResourcesForSubject(req.params.subjectId);
    if (!details) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    res.json({
      success: true,
      count: details.resources.studyMaterials.length,
      data: details.resources.studyMaterials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getSubjectImportantTopics(req, res) {
  try {
    const details = await getResourcesForSubject(req.params.subjectId);
    if (!details) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    res.json({
      success: true,
      count: details.resources.importantTopics.length,
      data: details.resources.importantTopics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getSubjectVideos(req, res) {
  try {
    const details = await getResourcesForSubject(req.params.subjectId);
    if (!details) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    res.json({
      success: true,
      count: details.resources.videos.length,
      data: details.resources.videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getSubjectPracticals(req, res) {
  try {
    const details = await getResourcesForSubject(req.params.subjectId);
    if (!details) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    res.json({
      success: true,
      count: details.resources.practicals.length,
      data: details.resources.practicals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getSubjectLearningProcess(req, res) {
  try {
    const details = await getResourcesForSubject(req.params.subjectId);
    if (!details) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    res.json({
      success: true,
      count: details.resources.learningProcess.length,
      data: details.resources.learningProcess
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  getSubjectResources,
  getSubjectSyllabus,
  getSubjectMaterials,
  getSubjectImportantTopics,
  getSubjectVideos,
  getSubjectPracticals,
  getSubjectLearningProcess
};
