# MedPath Learning Hub Backend - Final API Walkthrough

This document outlines every REST API endpoint exposed by the MedPath Learning Hub Backend service.

---

## 1. Public Metadata & Diagnostics

### Health Status
* **Endpoint**: `GET /api/health`
* **Access**: Public
* **Description**: Confirms the backend server process is operational.
* **Response**:
  ```json
  {
    "success": true,
    "status": "OK",
    "service": "MedPath Learning Hub Backend"
  }
  ```

### Project Summary
* **Endpoint**: `GET /api/project/summary`
* **Access**: Public
* **Description**: Returns global metadata mapping, coursework lists, modules checklist, and API groups.
* **Response**:
  ```json
  {
    "success": true,
    "project": "MedPath Learning Hub",
    "tagline": "Guiding Your Healthcare Journey",
    "description": "A learning portal backend for nursing and pharmacy students.",
    "courses": ["B.Pharm", "B.Sc Nursing", "GNM Nursing"],
    "backendModules": [...],
    "apiGroups": { ... },
    "status": "Backend completed and ready for final submission"
  }
  ```

### Self-Documenting API Routes Catalog
* **Endpoint**: `GET /api/docs`
* **Access**: Public
* **Description**: Returns structured details for all active paths, query keys, request parameters, and headers.

---

## 2. Course & Curriculum APIs

### Get All Courses
* **Endpoint**: `GET /api/courses`
* **Access**: Public
* **Description**: Fetches all registered courses (B.Pharm, B.Sc Nursing, GNM Nursing).

### Get Course Details
* **Endpoint**: `GET /api/courses/:courseId`
* **Access**: Public
* **Description**: Fetches full course metadata including nested semester and subject trees.

### Get Course Semesters
* **Endpoint**: `GET /api/courses/:courseId/semesters`
* **Access**: Public
* **Description**: Lists all semesters/years under a course.

---

## 3. Subject APIs

### Flat Subjects Index
* **Endpoint**: `GET /api/subjects`
* **Access**: Public
* **Description**: Fetches all subjects across all courses.

### Subject Details
* **Endpoint**: `GET /api/subjects/:subjectId`
* **Access**: Public
* **Description**: Retrieves detailed metadata for a single subject.

### Keyword Search
* **Endpoint**: `GET /api/search?query=<term>`
* **Access**: Public
* **Description**: Returns all subjects, courses, or semesters matching the query string.

### Course tree
* **Endpoint**: `GET /api/frontend/course-tree`
* **Access**: Public
* **Description**: Fetches the structured tree of courses, semesters, and subjects.

---

## 4. Subject Resource APIs

All study resources are grouped by category under specific subjects:

* `GET /api/subjects/:subjectId/resources` - Flat list of all resources.
* `GET /api/subjects/:subjectId/syllabus` - Get subject units structure.
* `GET /api/subjects/:subjectId/materials` - Get study materials (PDFs).
* `GET /api/subjects/:subjectId/important-topics` - Get crucial exam topics.
* `GET /api/subjects/:subjectId/videos` - Get video lectures.
* `GET /api/subjects/:subjectId/practicals` - Get lab guidelines.
* `GET /api/subjects/:subjectId/learning-process` - Get study directions.

---

## 5. Administrative Authentication & Resource Management

### Admin Authentication Login
* **Endpoint**: `POST /api/auth/admin/login`
* **Access**: Public (requires username and password)
* **Response**:
  ```json
  {
    "success": true,
    "token": "<JWT_signed_token>"
  }
  ```

### Create/Replace Subject Resources
* **Endpoint**: `POST /api/admin/subjects/:subjectId/resources`
* **Access**: Protected (requires JWT Bearer Token or `x-admin-key` direct bypass header)

### Edit/Patch Subject Details
* **Endpoint**: `PUT /api/admin/subjects/:subjectId/resources`
* **Access**: Protected (requires JWT Bearer Token or `x-admin-key` direct bypass header)

### Delete/Reset Subject Resources
* **Endpoint**: `DELETE /api/admin/subjects/:subjectId/resources`
* **Access**: Protected (requires JWT Bearer Token or `x-admin-key` direct bypass header)

---

## 6. Logs & Auditing APIs

These endpoints are used to track system requests and mutations:

### Request Activity Logs
* **Endpoint**: `GET /api/admin/logs/requests`
* **Access**: Protected (requires JWT Bearer Token or `x-admin-key` direct bypass header)

### Administrative Audit Logs
* **Endpoint**: `GET /api/admin/logs/activities`
* **Access**: Protected (requires JWT Bearer Token or `x-admin-key` direct bypass header)
