# MedPath Learning Hub Backend - Presentation Demo Script

This presentation script guides you through demonstrating the backend modules to mentors and evaluators during the final project review.

---

## 1. Environment Preparation & Booting

### Step A: Boot the Backend Service
Ensure your local configurations are loaded and launch the HTTP server:
```bash
npm start
```
*Evaluator Note*: Explain that the database pool is initialized first. If MySQL is offline, point out the warning log showing the server automatically falling back to mock files, ensuring continuous uptime.

---

## 2. API Demonstration Sequence

To conduct a structured walk-through, execute queries in the following logical sequence:

### API 1: Health Diagnostics
* **Path**: `GET /api/health`
* **Purpose**: Verifies the backend server is active and responding.
* **Proves**: Connection listening, Express framework loading, and basic response parsing are functional.

### API 2: Project Metadata Overview
* **Path**: `GET /api/project/summary`
* **Purpose**: Retrieves project-wide specifications, coursework list, and mounted route structures.
* **Proves**: Integration completeness and transitions metrics availability.

### API 3: Dynamic Self-Documentation Table
* **Path**: `GET /api/docs`
* **Purpose**: Renders the complete, self-documenting endpoints catalog.
* **Proves**: Easy integration support for frontend engineers without manual schema guides.

### API 4: Academic Courses Retrieval
* **Path**: `GET /api/courses`
* **Purpose**: Fetches the high-level list of active courses (B.Pharm, B.Sc Nursing, GNM Nursing).
* **Proves**: Base curricula database query capabilities.

### API 5: Flat Subjects Index
* **Path**: `GET /api/subjects`
* **Purpose**: Returns all subjects registered in the system.
* **Proves**: Broad database indexing support.

### API 6: Frontend Course Hierarchical Tree
* **Path**: `GET /api/frontend/course-tree`
* **Purpose**: Fetches the structured tree of courses, semesters, and subjects.
* **Proves**: Deep nested data formatting and frontend compatibility structures.

### API 7: Keyword Search Query
* **Path**: `GET /api/search?query=anatomy`
* **Purpose**: Executes keyword matching across course details, semesters, and subjects.
* **Proves**: Text matching search capabilities.

---

## 3. Administrative Authentication & Log Auditing Demo

Demonstrate security controls and request tracking as follows:

### Step A: Access Protected Logs Without Credentials (Expect Failure)
1. Attempt a query to fetch requests activity logs:
   `GET /api/admin/logs/requests`
2. **Outcome**: The server responds with status `401 Unauthorized` (or redirects/errors via middleware).
3. **Proves**: Security middleware correctly blocks unauthenticated clients.

### Step B: Administrative Login (Expect Success)
1. Execute a credentials verification query:
   * **Path**: `POST /api/auth/admin/login`
   * **Payload**:
     ```json
     {
       "username": "admin",
       "password": "MedPath@123"
     }
     ```
2. **Outcome**: Returns status `200 OK` with a signed `token` payload.
3. **Proves**: JWT credentials check and encryption hashing.

### Step C: Query Audited Logs Using Admin API Key Bypass
1. Query the requests log metric endpoint attaching the direct access token:
   * **Path**: `GET /api/admin/logs/requests`
   * **Headers**: `x-admin-key: medpath-admin-123`
2. **Outcome**: Returns the client request statistics history logs.
3. **Proves**: API key authorization fallback mechanism.

---

## 4. Summary Wrap-up (What to tell the Mentor)

Conclude the demonstration by highlighting these core architectural points:
1. **Database Resilience fallback**: Mention that if the MySQL server crashes during operations, the service seamlessly transitions to file-cached static arrays without dropping connections.
2. **Comprehensive Automation Testing**: Highlight that we run `npm run demo-check` to validate all 9 core endpoints in under 2 seconds.
3. **Dual Log Auditing**: Describe that public traffic is saved separately from admin alterations, which protects security compliance data.
