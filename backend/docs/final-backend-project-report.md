# MedPath Learning Hub Backend - Final Project Report

This report outlines the technical architecture, development cycle, and operational features of the MedPath Learning Hub Backend service.

---

## 1. Project Specifications
* **Project Title**: MedPath Learning Hub
* **Tagline**: Guiding Your Healthcare Journey
* **Backend Role**: Sole Backend Developer. Responsible for API architecture, database pooling design, fallback mechanisms, logging streams, security authentication middle-wares, and automated test runners.

---

## 2. Technical Stack

* **Runtime Environment**: Node.js (v18+)
* **Web Framework**: Express.js
* **Database Engine**: MySQL relational server
* **Client Driver**: `mysql2/promise` (supporting connection pools)
* **Authentication**: JWT token validation alongside header-based API key checking
* **Operational Monitoring**: Custom request and auditing activity logger middlewares

---

## 3. Database Architecture & Resiliency Fallback
The backend connects to MySQL using pooling to manage socket leases. To guarantee 100% uptime:
- **Mock Fallback**: If the MySQL service is unreachable on startup or drops at runtime, controllers automatically fall back to serving raw cached datasets from [courseData.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/src/data/courseData.js).

---

## 4. Completed Course Modules
1. **Academic Curricula Retriver**: Exposes endpoints to query courses, semesters, subjects, and study materials.
2. **Dynamic Course Tree Generator**: Computes the nested hierarchy array of courses, semesters, and subjects to support frontend sidebars.
3. **Keyword Search Engine**: Queries subjects, courses, and semesters matching query strings.
4. **Self-Documenting REST Router**: Serves active endpoints schema maps dynamically.
5. **Administrative Management Panel**: Restricts access and validates payload structures for mutation logs.
6. **Logging Analytics**: Captures request footprints and auditing data.

---

## 5. API Reference Table

### Public General & Academic Endpoints
* `GET /api/health` - Diagnostics health check
* `GET /api/project/summary` - Project metadata details
* `GET /api/docs` - Dynamic API docs routing catalog
* `GET /api/courses` - Academic courses list
* `GET /api/courses/:courseId` - Single course detail and nested subjects
* `GET /api/courses/:courseId/semesters` - Semesters lookup list
* `GET /api/courses/:courseId/subjects` - Subject list of a course
* `GET /api/courses/:courseId/semesters/:semesterId/subjects` - Semester subject catalog
* `GET /api/subjects` - Flat subjects index
* `GET /api/subjects/:subjectId` - Subject metadata details
* `GET /api/frontend/course-tree` - Course tree nesting
* `GET /api/search?query=...` - Keyword search engine
* `GET /api/subjects/:subjectId/resources` - Flat resource list
* `GET /api/subjects/:subjectId/syllabus` - Syllabus structure
* `GET /api/subjects/:subjectId/materials` - Study PDFs list
* `GET /api/subjects/:subjectId/important-topics` - Exam topics list
* `GET /api/subjects/:subjectId/videos` - Video lectures
* `GET /api/subjects/:subjectId/practicals` - Lab guidelines
* `GET /api/subjects/:subjectId/learning-process` - Study steps guide

### Administrative & Logging Endpoints (Protected)
* `POST /api/auth/admin/login` - Authenticate admin credentials and retrieve JWT
* `POST /api/admin/subjects/:subjectId/resources` - Create/replace learning resources
* `PUT /api/admin/subjects/:subjectId/resources` - Edit/patch study details
* `DELETE /api/admin/subjects/:subjectId/resources` - Reset resources under a subject
* `GET /api/admin/logs/requests` - Retrieve client HTTP activity metrics
* `GET /api/admin/logs/activities` - Retrieve administrative action audits

---

## 6. Authentication Protocols
Protected routes under `/api/admin/` require token authentication:
- **JWT token validation**: Signed with `JWT_SECRET` keys and passed in HTTP `Authorization: Bearer <token>` headers.
- **Direct API Key bypass fallback**: Checks request headers for `x-admin-key: <ADMIN_API_KEY>` to assist testing scripts.

---

## 7. Logging & Auditing Infrastructure
* **Request Logger Middleware**: Writes client footprints to [request_activity.log](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/logs/request_activity.log).
* **Admin Audit Logger Middleware**: Records login events and resource mutations to [admin_activity.log](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/logs/admin_activity.log).

---

## 8. Test Runners Suite
1. `test-production-check.js`: Basic database and API check.
2. `test-all-apis.js`: Automated API CRUD cycle integration testing.
3. `test-final-submission.js`: Config validations, credentials checks, gitignore audit.
4. `test-deployment-readiness.js`: Checks file existence and settings formatting.
5. `test-demo-flow.js`: Sequenced 9 checks validating demo presentations.
6. `test-submission-complete.js`: Verifies 7 endpoints and 5 submission documentation logs.

---

## 9. Deployment Readiness
Verified that port bindings use dynamic resolution (`process.env.PORT || 5000`) and `.gitignore` ignores dependency packages (`node_modules/`) and environment keys (`.env`). Running `npm run deploy-check` confirms a 100% green checklist status.

---

## 10. Final Outcome
All backend modules are fully developed, documented, and tested. The API service is complete and ready for final submission and frontend integration.
