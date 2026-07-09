# Day 15: API Documentation & Integration Testing

This document details the design, implementation, and automated validation of the self-documenting API router and the unified endpoint validation suite on the MedPath Learning Hub Backend.

---

## 1. Architectural Design

To facilitate ease of integration for frontend developers, we implemented a self-documenting endpoint at `/api/docs`. This allows developers or external agents to query the system for a complete list of endpoints, descriptions, route parameters, headers, and body schemas.

```text
Request Pipeline:
[Client Request: GET /api/docs]
               │
               ▼
   [backend/src/app.js]
               │
               ▼
[backend/src/routes/apiDocsRoutes.js]
               │
               ▼
[backend/src/controllers/apiDocsController.js]  ──► Returns structured JSON of all API routes
```

### Components Added/Modified:
1. **Controller:** [apiDocsController.js](file:///c:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/src/controllers/apiDocsController.js) compiles a list of all route groups (General, Auth, Courses, Subjects, Resources, Admin, Logs) with descriptions and inputs.
2. **Router:** [apiDocsRoutes.js](file:///c:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/src/routes/apiDocsRoutes.js) maps `GET /docs` to the controller.
3. **App Integration:** [app.js](file:///c:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/src/app.js) imports and mounts the documentation routes under the `/api` prefix.

---

## 2. API Specifications: `GET /api/docs`

* **Method**: `GET`
* **Access**: Public (No authentication required)
* **Response Structure**:
```json
{
  "success": true,
  "data": {
    "title": "MedPath Learning Hub API Documentation",
    "version": "1.0.0",
    "description": "Comprehensive guide to all endpoints available in the MedPath Learning Hub Backend API.",
    "baseUrl": "http://localhost:5000",
    "endpoints": [
      {
        "group": "General",
        "routes": [
          {
            "path": "/",
            "method": "GET",
            "description": "Welcome endpoint returning backend status message",
            "authRequired": false
          },
          ...
        ]
      },
      ...
    ]
  }
}
```

---

## 3. Unified Validation: `test-all-apis.js`

To verify all system features, we created [test-all-apis.js](file:///c:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/test-all-apis.js). This integration test runs against a live backend server and validates every individual endpoint group:

- **General endpoints:** `GET /`, `GET /api/health`, and `GET /api/docs`.
- **Course endpoints:** `GET /api/courses`, detail fetching, and subject hierarchy filters.
- **Subject & Resource endpoints:** `GET /api/subjects`, subject lookup, keyword search, and sub-resource lists (syllabus, materials, important topics, videos, practicals, learning-process).
- **Auth & Admin endpoints:** Admin authentication, JWT token payload checks, unauthorized endpoint blocking (401 response checks), and resource update requests (using both JWT Bearer tokens and `x-admin-key` headers).
- **Logger metrics retrieval:** `GET /api/admin/logs/requests` and `GET /api/admin/logs/activities`.

### How to Run:

1. **Start the backend server:**
   ```bash
   cd backend
   node server.js
   ```

2. **Execute the integration test suite in a separate terminal:**
   ```bash
   cd backend
   node test-all-apis.js
   ```

---

## 4. Expected Test Outputs

Upon running the script, the test runner displays structured confirmation logs for every endpoint validated:

```text
Starting MedPath Learning Hub Backend API Integration Tests...


--- Testing General Endpoints ---
  [PASS] GET / returns status 200
  [PASS] GET / returns success: true
  [PASS] GET / returns correct message
  [PASS] GET /api/health returns status 200
  [PASS] GET /api/health returns status: OK
  [PASS] GET /api/docs returns status 200
  [PASS] GET /api/docs returns success: true
  [PASS] GET /api/docs returns correct title
  [PASS] GET /api/docs returns endpoints array

--- Testing Course Endpoints ---
  [PASS] GET /api/courses returns status 200
  [PASS] GET /api/courses returns success: true
  [PASS] GET /api/courses returns data array
  [PASS] GET /api/courses/bpharm returns status 200
  [PASS] GET /api/courses/bpharm returns success: true
  ...
```
