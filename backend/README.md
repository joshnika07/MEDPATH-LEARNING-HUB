# MedPath Learning Hub Backend

This is the backend service for the MedPath Learning Hub, an online education portal for pharmacy and nursing students.

## Backend Description
The backend manages administrative logging, student curriculum retrieval, courses, semesters, subjects, syllabus information, PDF study materials, learning video lists, exam topics, and practical laboratory guidelines. It uses a MySQL relational database for persistent storage and includes an automatic memory-cached static JSON fallback if MySQL is not available.

## Technologies Used
* **Runtime Environment**: Node.js (v18+)
* **Web Framework**: Express.js
* **Database Management**: MySQL with the `mysql2` client library (connection pool supported)
* **Authentication**: JWT (JSON Web Tokens) and header-based Direct API Key validation
* **Logging Engine**: Custom file and console logging middleware
* **Process Watcher**: `nodemon` (for development auto-reload)

---

## Folder Structure
```text
backend/
├── docs/                 # Day-to-day progress documents and reports
├── logs/                 # Persistent request and admin activity logs
├── src/                  # Source root directory
│   ├── config/           # Database configurations
│   │   └── db.js         # MySQL connection pool initializers
│   ├── controllers/      # Handlers resolving routing operations
│   │   ├── adminResourceController.js
│   │   ├── apiDocsController.js
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── logController.js
│   │   └── resourceController.js
│   ├── data/             # Sample database mapping configuration
│   │   └── courseData.js # Static catalog data definitions & slug templates
│   ├── middleware/       # Express middlewares
│   │   ├── adminActivityLogger.js
│   │   ├── errorHandler.js
│   │   ├── jwtAuth.js
│   │   ├── notFound.js
│   │   └── requestLogger.js
│   ├── models/           # Persistent schema queries
│   │   └── courseModel.js # MySQL database queries for courses and subjects
│   ├── routes/           # Routing engines mapping URLs to handlers
│   │   ├── adminResourceRoutes.js
│   │   ├── apiDocsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── logRoutes.js
│   │   ├── resourceRoutes.js
│   │   └── subjectRoutes.js
│   ├── utils/            # Shared helper functions
│   │   └── resourceTemplate.js
│   └── app.js            # Express app middleware definitions
├── database/             # Relational schema backups
│   └── medpath.sql       # Backup schema & initial seed data dump
├── server.js             # Entry point file with graceful shutdowns
├── package.json          # Node dependency registry and script aliases
├── .env                  # Confidential local environment secrets
└── .env.example          # Template configuration instructions
```

---

## Environment Setup
1. Create a [.env](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/.env) file in the root `backend/` directory by copying the template file [.env.example](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/.env.example):
   ```bash
   cp .env.example .env
   ```
2. Modify the values inside `.env` to match your local MySQL configuration, JWT secret key, and API direct access key.

---

## How to Install Packages
In the `backend/` directory, execute:
```bash
npm install
```

---

## How to Run Backend
* To run in **Development Mode** (with automatic watch/restart):
  ```bash
  npm run dev
  ```
* To run in **Production Mode**:
  ```bash
  npm start
  ```

---

## How to Seed Database
You can seed the database schema and sample records by executing the seed SQL dump directly into your local database:
```bash
mysql -u root -p medpath_learning_hub < database/medpath.sql
```
Alternatively, you can trigger the database seed script:
```bash
npm run seed
```

---

## How to Test APIs
### A. Pre-Deployment Validation (Production Check)
Runs [test-production-check.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/test-production-check.js) which ensures variables in `.env` are configured correctly, verifies database connectivity, audits system privileges, checks writable log directories, and flags any default passwords:
```bash
node test-production-check.js
```

### B. End-to-End API Integration Suite
Runs [test-all-apis.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/test-all-apis.js) which executes a complete suite of mock request actions against the live application server (covers public lookup paths, admin resource uploads, log fetching, and self-documenting routing tables):
```bash
node test-all-apis.js
```

### C. Final Submission Verification Suite
Runs [test-final-submission.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/test-final-submission.js) which programmatically spawns the server if it is offline, verifies Git ignore exclusion rules (e.g., node_modules/ and .env tracking), package dependency scripts config, logs directory writability, and API responsiveness:
```bash
npm run final-check
```

---

## Important API List
All endpoint responses return JSON payloads.

### General Endpoints
* `GET /` - Welcome message.
* `GET /api/health` - Check backend system health status.
* `GET /api/docs` - Retrieve self-documenting routing table specs.

### Authentication Endpoints
* `POST /api/auth/admin/login` - Authenticate admin credentials and retrieve JWT.

### Course & Subject Lookup
* `GET /api/courses` - Retrieve all available academic courses.
* `GET /api/courses/:courseId` - Retrieve detailed course information including semesters.
* `GET /api/courses/:courseId/semesters` - Retrieve semesters under a course.
* `GET /api/courses/:courseId/subjects` - Retrieve all subjects under a course.
* `GET /api/courses/:courseId/semesters/:semesterId/subjects` - Retrieve subjects under a specific semester.
* `GET /api/subjects` - Retrieve flat index list of all subjects.
* `GET /api/subjects/:subjectId` - Retrieve subject metadata.
* `GET /api/search?query=...` - Keyword search across course, semester, or subject name.

### Study Resources
* `GET /api/subjects/:subjectId/resources` - Flat list of all resources.
* `GET /api/subjects/:subjectId/syllabus` - Get subject units structure.
* `GET /api/subjects/:subjectId/materials` - Get study materials (PDFs).
* `GET /api/subjects/:subjectId/important-topics` - Get crucial exam topics.
* `GET /api/subjects/:subjectId/videos` - Get video lectures.
* `GET /api/subjects/:subjectId/practicals` - Get lab guidelines.
* `GET /api/subjects/:subjectId/learning-process` - Get study directions.

### Administrative Management (Protected)
* `POST /api/admin/subjects/:subjectId/resources` - Create/replace learning resources.
* `PUT /api/admin/subjects/:subjectId/resources` - Edit/patch study details.
* `DELETE /api/admin/subjects/:subjectId/resources` - Reset resources for a subject.

### Activity Logs (Protected)
* `GET /api/admin/logs/requests` - Retrieve client HTTP activity metrics.
* `GET /api/admin/logs/activities` - Retrieve administrative action audits.

---

## Admin Authentication Note
All administrative endpoints starting with `/api/admin` require authentication. The server checks:
1. `Authorization: Bearer <token>` header containing a valid signed JWT.
2. `x-admin-key: <key>` header matching the system key (e.g. `medpath-admin-123` or custom production keys) as a bypass fallback.

---

## Logging Note
The system employs custom loggers to trace and audit activity:
* **Request Logger**: Logs all public access requests (such as `/api/health`, `/api/courses`) in the console and writes them to [request_activity.log](file:///c:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/logs/request_activity.log).
* **Admin Activity Logger**: Audits all login events and data-altering requests made to protected resources, logging actions to the console and to [admin_activity.log](file:///c:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/logs/admin_activity.log).

---

## Deployment Readiness
Before deploying the service to staging or production, execute the automated readiness validation suite to confirm configuration safety and structural integrity:
```bash
npm run deploy-check
```
For more details, see the [Deployment Guide](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/docs/deployment-guide.md).

---

## Final Backend Summary
To retrieve a comprehensive overview of the MedPath Learning Hub project details, completed backend modules, and grouped API paths, execute a GET request to:
```http
GET /api/project/summary
```
For more information, see the [Backend Internship Summary](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/docs/backend-internship-summary.md).
