# Day 14: Request & Admin Activity Logging System

This document describes the request logging and admin action auditing architecture implemented on the MedPath Learning Hub Backend.

---

## 1. Architectural Overview

The logging architecture is split into two specialized middlewares to isolate standard request metrics from sensitive admin activity records.

```text
Request Pipeline:
[Client Request]
       │
       ▼
[app.use(requestLogger)] ───► Logs GET /api/health & GET /api/courses to console
       │                      AND backend/logs/request_activity.log
       ▼
[app.use(adminActivityLogger)] ──► Logs Admin actions (Login, PUT/DELETE resource)
       │                           to console AND backend/logs/admin_activity.log
       ▼
[app.use(jwtAuth)] ──────────► Checks JWT Bearer Token / x-admin-key Header
       │
       ▼
[Admin Resource & Log Routes]
```

---

## 2. Logger Middlewares

### Request Logger (`requestLogger.js`)
* **File:** [requestLogger.js](file:///c:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/src/middleware/requestLogger.js)
* **Description:** Intercepts standard GET requests to monitor server health status and course retrieval traffic.
* **Target Routes:**
  * `GET /api/health`
  * `GET /api/courses`
* **Output:** Server Console and [request_activity.log](file:///c:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/logs/request_activity.log).

### Admin Activity Logger (`adminActivityLogger.js`)
* **File:** [adminActivityLogger.js](file:///c:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/src/middleware/adminActivityLogger.js)
* **Description:** Audits administrator interactions, writing metadata to `backend/logs/admin_activity.log` and duplicating logs to the server console.
* **Target Routes:**
  * `POST /api/auth/admin/login`
  * `PUT /api/admin/subjects/:subjectId/resources`
  * `DELETE /api/admin/subjects/:subjectId/resources`
* **Output:** Console and [admin_activity.log](file:///c:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/logs/admin_activity.log).

---

## 3. Admin Log Retrieval APIs

Both endpoints require JWT Bearer Token (`Authorization: Bearer <token>`) or API key (`x-admin-key: <key>`).

* **Controller:** [logController.js](file:///c:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/src/controllers/logController.js)
* **Routing File:** [logRoutes.js](file:///c:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/src/routes/logRoutes.js)

### 3.1. Standard Request Logs
* **Endpoint:** `GET /api/admin/logs/requests`
* **Response Format:**
```json
{
  "success": true,
  "count": 2,
  "logs": [
    "[2026-07-07T06:29:07.452Z] GET /api/health - 200 (15ms)",
    "[2026-07-07T06:29:07.561Z] GET /api/courses - 200 (8ms)"
  ]
}
```

### 3.2. Admin Activity Logs
* **Endpoint:** `GET /api/admin/logs/activities`
* **Response Format:**
```json
{
  "success": true,
  "count": 2,
  "logs": [
    "[2026-07-07T06:29:07.672Z] Admin Action: POST /api/auth/admin/login | Status: 200 | User: admin | Duration: 92ms",
    "[2026-07-07T06:29:07.781Z] Admin Action: PUT /api/admin/subjects/... | Status: 200 | User: admin | Duration: 72ms"
  ]
}
```
