# MedPath Learning Hub Backend

This repository contains the Node.js / Express backend service for the MedPath Learning Hub. The backend manages courses, subjects, syllabi, PDF study materials, learning videos, important exam topics, and practical guidelines, utilizing a MySQL relational database.

---

## Folder Structure

```text
backend/
├── config/           # Database configuration and connection setup
│   └── db.js         # MySQL connection pool configuration
├── controllers/      # Route request/response handlers
│   ├── courseController.js
│   ├── subjectController.js
│   ├── materialController.js
│   ├── syllabusController.js
│   ├── videoController.js
│   ├── topicController.js
│   └── practicalController.js
├── data/             # Seeding scripts and mock/sample data
│   └── sample_data.sql # Relational database seed data statements
├── database/         # Database schema files
│   ├── medpath.sql   # Combined schema and seed backup
│   └── schema.sql    # Relational database schema table definitions
├── models/           # Database queries and mappings
│   ├── Course.js
│   ├── Subject.js
│   ├── Material.js
│   ├── Syllabus.js
│   ├── Video.js
│   ├── Topic.js
│   └── Practical.js
├── routes/           # Router middleware mapping routes to controllers
│   ├── courseRoutes.js
│   ├── subjectRoutes.js
│   ├── materialRoutes.js
│   ├── syllabusRoutes.js
│   ├── videoRoutes.js
│   ├── topicRoutes.js
│   └── practicalRoutes.js
├── uploads/          # Local media directory for PDF/video uploads
├── .env              # Environment configuration variables
├── server.js         # Express app startup and configuration entry point
└── package.json      # Node dependency registry and build commands
```

---

## Technical Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database Driver:** `mysql2` (supports both promise-based pools and direct connections)
* **Development Server:** `nodemon`

---

## Getting Started

### 1. Installation
Clone the repository and install the dependencies from the `backend/` directory:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory and configure the database connection details:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=medpath_db
```

### 3. Initialize the Database
Import the schema and initial seed data into your local MySQL database:
```bash
mysql -u root -p medpath_db < database/schema.sql
mysql -u root -p medpath_db < data/sample_data.sql
```

### 4. Running the Server
To start the application in development mode with auto-reload:
```bash
npm run dev
```

To run in production mode:
```bash
npm start
```

---

## API Endpoints Reference

All endpoints return data in JSON format and are prefixed with `/api`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/courses` | Retrieve list of all courses |
| **GET** | `/api/course/:id` | Retrieve detailed information for a specific course |
| **GET** | `/api/subjects/:courseId` | Retrieve all subjects for a specific course ID |
| **GET** | `/api/syllabus/:subjectId` | Retrieve syllabus units for a specific subject ID |
| **GET** | `/api/materials/:subjectId` | Retrieve learning materials (PDFs) for a subject ID |
| **GET** | `/api/videos/:subjectId` | Retrieve learning videos for a subject ID |
| **GET** | `/api/topics/:subjectId` | Retrieve list of important exam topics for a subject ID |
| **GET** | `/api/practicals/:subjectId` | Retrieve practical lesson details for a subject ID |
