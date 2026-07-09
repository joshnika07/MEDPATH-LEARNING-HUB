/**
 * API Documentation Controller
 * Implements the endpoint to retrieve structured API documentation.
 */

async function getApiDocs(req, res) {
  try {
    const documentation = {
      title: "MedPath Learning Hub API Documentation",
      version: "1.0.0",
      description: "Comprehensive guide to all endpoints available in the MedPath Learning Hub Backend API.",
      projectSummary: "GET /api/project/summary",
      baseUrl: process.env.BASE_URL || "http://localhost:5000",
      endpoints: [
        {
          group: "General",
          routes: [
            {
              path: "/",
              method: "GET",
              description: "Welcome endpoint returning backend status message",
              authRequired: false
            },
            {
              path: "/api/health",
              method: "GET",
              description: "Check health status of the backend services",
              authRequired: false
            },
            {
              path: "/api/docs",
              method: "GET",
              description: "Retrieve this structured API documentation",
              authRequired: false
            },
            {
              path: "/api/project/summary",
              method: "GET",
              description: "Retrieve project overview and backend summary details",
              authRequired: false
            }
          ]
        },
        {
          group: "Auth",
          routes: [
            {
              path: "/api/auth/admin/login",
              method: "POST",
              description: "Authenticate admin user and generate a JWT token",
              authRequired: false,
              bodyParameters: {
                username: "Admin username (string, required)",
                password: "Admin password (string, required)"
              }
            }
          ]
        },
        {
          group: "Courses",
          routes: [
            {
              path: "/api/courses",
              method: "GET",
              description: "Retrieve all academic courses (e.g., B.Pharm, M.Pharm)",
              authRequired: false
            },
            {
              path: "/api/courses/:courseId",
              method: "GET",
              description: "Retrieve details of a single course, including semesters and nested subjects",
              authRequired: false,
              pathParameters: {
                courseId: "Unique ID of the course (string, required)"
              }
            },
            {
              path: "/api/courses/:courseId/semesters",
              method: "GET",
              description: "Retrieve all semesters belonging to a specific course",
              authRequired: false,
              pathParameters: {
                courseId: "Unique ID of the course (string, required)"
              }
            },
            {
              path: "/api/courses/:courseId/subjects",
              method: "GET",
              description: "Retrieve all subjects belonging to a specific course",
              authRequired: false,
              pathParameters: {
                courseId: "Unique ID of the course (string, required)"
              }
            },
            {
              path: "/api/courses/:courseId/semesters/:semesterId/subjects",
              method: "GET",
              description: "Retrieve subjects for a specific semester under a course",
              authRequired: false,
              pathParameters: {
                courseId: "Unique ID of the course (string, required)",
                semesterId: "Unique ID of the semester (string, required)"
              }
            }
          ]
        },
        {
          group: "Subjects",
          routes: [
            {
              path: "/api/subjects",
              method: "GET",
              description: "Retrieve a flat list of all subjects across all courses",
              authRequired: false
            },
            {
              path: "/api/subjects/:subjectId",
              method: "GET",
              description: "Retrieve comprehensive details for a specific subject, including its resources",
              authRequired: false,
              pathParameters: {
                subjectId: "Unique ID of the subject (string, required)"
              }
            },
            {
              path: "/api/search",
              method: "GET",
              description: "Search for subjects across the portal matching a search term in subject, semester, or course name",
              authRequired: false,
              queryParameters: {
                query: "Search keyword (string, required)"
              }
            }
          ]
        },
        {
          group: "Resources",
          routes: [
            {
              path: "/api/subjects/:subjectId/resources",
              method: "GET",
              description: "Retrieve all learning resources of a subject",
              authRequired: false,
              pathParameters: { subjectId: "Unique ID of the subject" }
            },
            {
              path: "/api/subjects/:subjectId/syllabus",
              method: "GET",
              description: "Retrieve syllabus units of a subject",
              authRequired: false,
              pathParameters: { subjectId: "Unique ID of the subject" }
            },
            {
              path: "/api/subjects/:subjectId/materials",
              method: "GET",
              description: "Retrieve study materials of a subject",
              authRequired: false,
              pathParameters: { subjectId: "Unique ID of the subject" }
            },
            {
              path: "/api/subjects/:subjectId/important-topics",
              method: "GET",
              description: "Retrieve important exam/study topics for a subject",
              authRequired: false,
              pathParameters: { subjectId: "Unique ID of the subject" }
            },
            {
              path: "/api/subjects/:subjectId/videos",
              method: "GET",
              description: "Retrieve learning video links for a subject",
              authRequired: false,
              pathParameters: { subjectId: "Unique ID of the subject" }
            },
            {
              path: "/api/subjects/:subjectId/practicals",
              method: "GET",
              description: "Retrieve practical tasks/labs for a subject",
              authRequired: false,
              pathParameters: { subjectId: "Unique ID of the subject" }
            },
            {
              path: "/api/subjects/:subjectId/learning-process",
              method: "GET",
              description: "Retrieve learning process instructions/recommendations",
              authRequired: false,
              pathParameters: { subjectId: "Unique ID of the subject" }
            }
          ]
        },
        {
          group: "Admin",
          routes: [
            {
              path: "/api/admin/subjects/:subjectId/resources",
              method: "POST",
              description: "Create or replace learning resources for a subject",
              authRequired: true,
              headers: {
                Authorization: "Bearer <JWT_TOKEN> or x-admin-key: <ADMIN_KEY>"
              },
              pathParameters: {
                subjectId: "Unique ID of the subject (string, required)"
              },
              bodyParameters: {
                syllabusUnits: "Array of strings",
                studyMaterials: "Array of strings",
                importantTopics: "Array of strings",
                videos: "Array of strings",
                practicals: "Array of strings",
                learningProcess: "Array of strings"
              }
            },
            {
              path: "/api/admin/subjects/:subjectId/resources",
              method: "PUT",
              description: "Update (merge or replace) learning resources for a subject",
              authRequired: true,
              headers: {
                Authorization: "Bearer <JWT_TOKEN> or x-admin-key: <ADMIN_KEY>"
              },
              pathParameters: {
                subjectId: "Unique ID of the subject (string, required)"
              },
              bodyParameters: {
                syllabusUnits: "Array of strings (optional)",
                studyMaterials: "Array of strings (optional)",
                importantTopics: "Array of strings (optional)",
                videos: "Array of strings (optional)",
                practicals: "Array of strings (optional)",
                learningProcess: "Array of strings (optional)"
              }
            },
            {
              path: "/api/admin/subjects/:subjectId/resources",
              method: "DELETE",
              description: "Reset or delete all resources for a specific subject",
              authRequired: true,
              headers: {
                Authorization: "Bearer <JWT_TOKEN> or x-admin-key: <ADMIN_KEY>"
              },
              pathParameters: {
                subjectId: "Unique ID of the subject (string, required)"
              }
            }
          ]
        },
        {
          group: "Logs",
          routes: [
            {
              path: "/api/admin/logs/requests",
              method: "GET",
              description: "Retrieve standard request activities logged on the server",
              authRequired: true,
              headers: {
                Authorization: "Bearer <JWT_TOKEN> or x-admin-key: <ADMIN_KEY>"
              }
            },
            {
              path: "/api/admin/logs/activities",
              method: "GET",
              description: "Retrieve admin audit log logs",
              authRequired: true,
              headers: {
                Authorization: "Bearer <JWT_TOKEN> or x-admin-key: <ADMIN_KEY>"
              }
            }
          ]
        }
      ]
    };

    res.status(200).json({
      success: true,
      data: documentation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  getApiDocs
};
