# MedPath Learning Hub Backend - Handover Summary

This summary provides a complete technical handover report for the backend architecture of the MedPath Learning Hub.

---

## 1. Project Overview

The MedPath Learning Hub Backend is a robust web service that manages administrative tasks and course curricula for students. It serves academic courses, subjects, semesters, and curriculum resources (syllabus units, Study PDF materials, lecture video links, laboratory practical files, and learning guidelines).

---

## 2. Backend Technologies

* **Runtime Environment**: Node.js (v18+)
* **Web Framework**: Express.js
* **Database**: MySQL relational database utilizing connection pools.
* **Fallback System**: If MySQL database is not accessible on boot or runtime, the server utilizes a memory-cached static JSON fallback configuration ([courseData.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/src/data/courseData.js)) to guarantee uptime.
* **Authentication**: JWT token validation alongside header-based API key checking.
* **Logging System**: Custom Express middlewares capturing public metrics and write actions.

---

## 3. Completed Backend Modules

1. **Course Curriculum Engine**: Resolves paths for courses, semesters, subjects, and study materials.
2. **Dynamic Search Engine**: Performs keyword lookup across courses, semesters, and subjects.
3. **Self-Documenting API**: Generates routing tables detailing endpoints and parameters dynamically.
4. **Admin Panel Resource Manager**: Handles write, modify, and delete operations for subjects and curriculum materials.
5. **Security Authentication Layer**: Standardizes session JWT and fallback headers validation.
6. **Dual Logger Engine**: Records requests and administrative activity metrics.

---

## 4. API Registry Summary

### A. Public Academic & General Routes
* `GET /` - Welcome status
* `GET /api/health` - Health status confirmation
* `GET /api/docs` - Self-documenting API specifications
* `GET /api/courses` - Retrieve all registered academic courses
* `GET /api/courses/:courseId` - Retrieve detailed course information
* `GET /api/courses/:courseId/semesters` - Fetch semesters list under a course
* `GET /api/courses/:courseId/subjects` - Fetch flat subjects catalog under a course
* `GET /api/courses/:courseId/semesters/:semesterId/subjects` - Fetch semester subjects
* `GET /api/subjects` - Retrieve flat index lists of all subjects
* `GET /api/subjects/:subjectId` - Fetch subject details
* `GET /api/subjects/:subjectId/resources` - Flat list of all resources under a subject
* `GET /api/subjects/:subjectId/syllabus` - Get subject units structure
* `GET /api/subjects/:subjectId/materials` - Get study materials (PDFs)
* `GET /api/subjects/:subjectId/important-topics` - Get exam topics list
* `GET /api/subjects/:subjectId/videos` - Get video lectures
* `GET /api/subjects/:subjectId/practicals` - Get lab guidelines
* `GET /api/subjects/:subjectId/learning-process` - Get study steps
* `GET /api/search?query=<term>` - Keyword search engine

### B. Admin & Log Auditing Routes (Protected)
* `POST /api/auth/admin/login` - Admin credentials login
* `POST /api/admin/subjects/:subjectId/resources` - Create/overwrite subject resource files
* `PUT /api/admin/subjects/:subjectId/resources` - Edit/patch study details
* `DELETE /api/admin/subjects/:subjectId/resources` - Reset resources under a subject
* `GET /api/admin/logs/requests` - Retrieve public request metrics logs
* `GET /api/admin/logs/activities` - Retrieve administrative audit logs

---

## 5. Security & Authentication Layer

Administrative routes (paths starting with `/api/admin/`) require token verification:
- **JWT Authentication**: Validates signatures against `JWT_SECRET`. Tokens are extracted from `Authorization: Bearer <token>` request headers.
- **Admin API Key Fallback**: Direct backend accesses are bypass-supported using the header `x-admin-key` matching the environment setting `ADMIN_API_KEY`.

---

## 6. Operational Logging

* **Public Request Activity Log**:
  - Automatically records public traffic and endpoints queries.
  - Saved inside [request_activity.log](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/logs/request_activity.log).
* **Administrative Audit Log**:
  - Logs admin login events and all resource mutations (POST/PUT/DELETE).
  - Saved inside [admin_activity.log](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/logs/admin_activity.log).

---

## 7. Testing & Verification Suite

We have implemented three distinct test runners:
1. **Pre-Deployment Check ([test-production-check.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/test-production-check.js))**:
   - Assures basic database connection and API routes.
2. **Integration Test Suite ([test-all-apis.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/test-all-apis.js))**:
   - Verifies the full CRUD cycle, logs fetching, and error cases on a running server instance.
3. **Submission Check Suite ([test-final-submission.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/test-final-submission.js))**:
   - Validates `.env` credential leaks, gitignore policies, package scripts, and directory structures.
4. **Deployment Readiness Suite ([test-deployment-readiness.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/test-deployment-readiness.js))**:
   - Validates code files layout, `.env.example`, `package.json` setup, and port configuration. Run via `npm run deploy-check`.

---

## 8. Registry of Important Files

- **Application Entry**: [server.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/server.js) & [app.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/src/app.js)
- **DB Connection Pools**: [db.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/src/config/db.js)
- **Static fallback data**: [courseData.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/src/data/courseData.js)
- **Academic queries model**: [courseModel.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/src/models/courseModel.js)
- **Request loggers**: [requestLogger.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/src/middleware/requestLogger.js) & [adminActivityLogger.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/src/middleware/adminActivityLogger.js)

---

## 9. Future Technical Improvements

1. **Log Rotation Policy**: Integrate log-rotate scripts or use winston log-rotation modules to prevent files in `logs/` from becoming excessively large.
2. **Caching Strategy**: Implement memory caches (e.g., Redis or node-cache) for high-frequency database lookups of courses and subjects.
3. **Database connection limits**: Fine-tune parameters like `connectionLimit` and queue size thresholds based on real load test telemetry.
