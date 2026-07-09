# MedPath Learning Hub Backend - Internship Summary Report

This document compiles the complete backend engineering contributions, modules developed, architecture specifications, and engineering outcomes completed during the MedPath Learning Hub backend developer internship.

---

## 1. Project Overview & Backend Role
* **Project Name**: MedPath Learning Hub
* **Role**: Backend Developer Intern
* **Responsibility**: Designing, implementing, documenting, and validating the RESTful API service supporting the MedPath frontend portal. The service manages academic courses, semesters, subjects, and study materials for pharmacy and nursing students.

---

## 2. Core Technologies Used
* **Runtime**: Node.js (v18+)
* **Web Framework**: Express.js
* **Database**: MySQL relational database
* **Client Driver**: `mysql2/promise` (supporting connection pooling)
* **Authentication**: JSON Web Tokens (JWT via `jsonwebtoken`) and custom API key header validations
* **Logging System**: Custom Express file/console stream loggers

---

## 3. Completed Modules & Architectural Accomplishments

### A. Academic Curriculum Engine
Implemented relational queries and controllers to retrieve structural hierarchies:
- Courses retrieval (B.Pharm, B.Sc Nursing, GNM Nursing).
- Semester partitioning under specific courses.
- Semester-filtered subjects catalog indexing.
- Comprehensive subject resources (syllabus units structure, Study PDF guides, video lecture registries, laboratory practical guides, and study directions guidelines).

### B. Fallback Reliability Model
Engineered a memory-cached static JSON fallback mapping ([courseData.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/src/data/courseData.js)). If MySQL is unreachable on boot or connection breaks at runtime, the API automatically falls back to serving static mock data, guaranteeing 100% service availability.

### C. Keyword Search Engine
Developed a search controller performing query matching across courses, semesters, and subjects to yield filtered lookup lists.

### D. Administrative Panel Manager
Built write, modify, and delete operations (`POST`, `PUT`, `DELETE` resources) under protected routes, enabling administrative upload of syllabus details and materials.

### E. Self-Documenting Routing Table
Designed a dynamic endpoint `/api/docs` mapping out all mounted paths, request parameters, descriptions, and authentication guidelines to accelerate frontend integration.

---

## 4. API Catalog Developed

### Public API Group
- `GET /` - Welcome status
- `GET /api/health` - Live health check
- `GET /api/docs` - API documentation router
- `GET /api/project/summary` - Project metadata overview
- `GET /api/courses` - Active courses lookup
- `GET /api/courses/:courseId` - Single course details
- `GET /api/courses/:courseId/semesters` - Semesters lookup
- `GET /api/courses/:courseId/subjects` - Subject list of a course
- `GET /api/courses/:courseId/semesters/:semesterId/subjects` - Semester subject catalog
- `GET /api/subjects` - Flat subjects index
- `GET /api/subjects/:subjectId` - Subject metadata
- `GET /api/subjects/:subjectId/resources` - Flat resource list
- `GET /api/subjects/:subjectId/syllabus` - Syllabus structure
- `GET /api/subjects/:subjectId/materials` - Study PDFs list
- `GET /api/subjects/:subjectId/important-topics` - Exam topics list
- `GET /api/subjects/:subjectId/videos` - Video lectures
- `GET /api/subjects/:subjectId/practicals` - Lab guidelines
- `GET /api/subjects/:subjectId/learning-process` - Study steps guide
- `GET /api/search?query=<term>` - Keyword search engine

### Administrative & Logging API Group (Protected)
- `POST /api/auth/admin/login` - Admin login credentials validation
- `POST /api/admin/subjects/:subjectId/resources` - Upload/overwrite resources
- `PUT /api/admin/subjects/:subjectId/resources` - Edit/patch details
- `DELETE /api/admin/subjects/:subjectId/resources` - Reset resources
- `GET /api/admin/logs/requests` - Fetch HTTP request activity
- `GET /api/admin/logs/activities` - Fetch admin mutation logs

---

## 5. Security & Authentication Work
Implemented dual validation filters on administrative `/api/admin/` routes:
- **JWT Middleware**: Validates signed token payloads using `JWT_SECRET` keys passed inside the standard HTTP `Authorization: Bearer <token>` header.
- **Direct API Key**: Supports bypassing token flows during testing and automation using the `x-admin-key` header matching backend env setups.

---

## 6. Operational Monitoring & Logging
Developed two logging systems:
- **Request Logger**: Automatically records HTTP request methods, response times, and client IPs into [request_activity.log](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/logs/request_activity.log).
- **Admin Activity Logger**: Audits administrative logins and write/modify queries (POST/PUT/DELETE) into [admin_activity.log](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/logs/admin_activity.log).

---

## 7. Automated Testing & Verification
Programmed four test runners ensuring zero-regression codes:
1. **Production Check (`test-production-check.js`)**: Runs basic checks on health status and core data routes.
2. **Integration Test Suite (`test-all-apis.js`)**: Executes full CRUD cycles and metric logging fetches on active servers.
3. **Submission Verification (`test-final-submission.js`)**: Checks credential leaks, `.gitignore` tracking policies, logs folder writable permissions, and path responses. It automatically handles spawning and killing server processes.
4. **Project Summary Test (`test-project-summary.js`)**: Checks project summary API data returns.

---

## 8. Deployment Preparation Work
- Formulated the comprehensive [deployment-guide.md](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/docs/deployment-guide.md) mapping out cloud deployment steps and SQL schema restoration.
- Created [test-deployment-readiness.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/test-deployment-readiness.js) aliased in `package.json` as `npm run deploy-check` to run 12 verification checkpoints prior to environment packaging.

---

## 9. Internship Learning Outcomes
- **System Architecture Design**: Gained hands-on experience structuring Node/Express applications for scalability.
- **Database Resilience**: Implemented mock fallbacks to handle database outages gracefully.
- **Security Best Practices**: Solidified authentication flows (JWT + API Keys) and automated credentials verification testing.
- **Operational Infrastructure**: Designed custom request tracking and administrative audit log files.
