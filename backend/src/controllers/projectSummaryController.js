/**
 * Project Summary Controller
 * Serves summary metrics and API details for the MedPath Learning Hub Backend.
 */

async function getProjectSummary(req, res) {
  try {
    const summary = {
      success: true,
      project: "MedPath Learning Hub",
      tagline: "Guiding Your Healthcare Journey",
      description: "A learning portal backend for nursing and pharmacy students.",
      courses: [
        "B.Pharm",
        "B.Sc Nursing",
        "GNM Nursing"
      ],
      backendModules: [
        "Course APIs",
        "Subject APIs",
        "Search API",
        "Subject Resource APIs",
        "Admin Resource APIs",
        "Admin Authentication",
        "Request Logging",
        "API Documentation",
        "Deployment Readiness"
      ],
      apiGroups: {
        publicApis: [
          "GET /api/health",
          "GET /api/courses",
          "GET /api/subjects",
          "GET /api/search?query=anatomy"
        ],
        frontendApis: [
          "GET /api/frontend/course-tree"
        ],
        resourceApis: [
          "GET /api/subjects/:subjectId/resources",
          "GET /api/subjects/:subjectId/syllabus",
          "GET /api/subjects/:subjectId/materials",
          "GET /api/subjects/:subjectId/important-topics",
          "GET /api/subjects/:subjectId/videos",
          "GET /api/subjects/:subjectId/practicals",
          "GET /api/subjects/:subjectId/learning-process"
        ],
        adminApis: [
          "POST /api/auth/admin/login",
          "POST /api/admin/subjects/:subjectId/resources",
          "PUT /api/admin/subjects/:subjectId/resources",
          "DELETE /api/admin/subjects/:subjectId/resources",
          "GET /api/admin/logs/requests",
          "GET /api/admin/logs/activities"
        ]
      },
      status: "Backend completed and ready for final submission"
    };

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  getProjectSummary
};
