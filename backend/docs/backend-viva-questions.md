# MedPath Learning Hub Backend - Viva Q&A Guide

This study guide contains 20 core technical questions and detailed answers to prepare you for vivas, interviews, and project presentations.

---

### Q1: What is Node.js, and how does it handle asynchronous operations?
**Answer**: Node.js is an open-source, cross-platform JavaScript runtime environment built on Chrome's V8 engine. It uses a single-threaded event loop architecture that manages asynchronous operations non-blockingly using libuv threadpools. When an I/O operation (like a database query) is invoked, Node hands it over to the system kernel or background threads, continuing execution of remaining code. Once completed, callbacks are queued to the event loop for execution.

### Q2: What is Express.js, and why is it used in this project?
**Answer**: Express.js is a minimal and flexible Node.js web application framework that provides robust routing mechanisms, middleware integrations, and HTTP request/response handlers. In MedPath, it maps client URL queries to controller functions and processes application middleware.

### Q3: Explain what Middleware is in Express.js. Give examples from your project.
**Answer**: Middleware functions are functions that have access to the request object (`req`), response object (`res`), and the next middleware function in the application's request-response cycle (`next`). They can run code, modify request/response parameters, and end cycles. 
*Examples in MedPath*: 
- [requestLogger.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/src/middleware/requestLogger.js) (logs traffic)
- [jwtAuth.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/src/middleware/jwtAuth.js) (validates headers)
- `express.json()` (parses JSON body payloads)

### Q4: What is a REST API, and what are its key characteristics?
**Answer**: Representational State Transfer (REST) is an architectural style for designing networked applications. Key characteristics include:
- **Statelessness**: Each client request contains all data required to process it.
- **Client-Server Separation**: Independent interfaces.
- **Uniform Interface**: Uses standard HTTP verbs (`GET` to fetch, `POST` to create, `PUT` to edit, `DELETE` to reset) and standard status codes (`200 OK`, `401 Unauthorized`, `404 Not Found`).

### Q5: How does MedPath handle database pooling, and what driver is used?
**Answer**: MedPath uses the `mysql2/promise` driver to initiate connection pools. Instead of opening and closing database sockets for every query (which causes latency), connection pools retain a set of open sockets (e.g. 10 connections limit). Sockets are leased on query and returned on release.

### Q6: Explain the MySQL Static Mock Fallback pattern implemented in this project.
**Answer**: If the MySQL service is unreachable during booting or crashes at runtime, `connectDB()` logs a warning and returns `null`. The controllers catch this status and fallback to querying from [courseData.js](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/src/data/courseData.js), ensuring the API remains active.

### Q7: What is JWT (JSON Web Token), and how does it secure administrative endpoints?
**Answer**: JWT is a compact, URL-safe standard for representing claims between two parties. It contains three parts: Header, Payload (e.g., admin ID), and Signature. When an admin logs in successfully, the backend returns a token signed using a secret key (`JWT_SECRET`). The client sends this token inside the `Authorization: Bearer <token>` header on subsequent requests.

### Q8: What is the Admin API Key fallback check?
**Answer**: In addition to JWT token validation, administrative endpoints accept direct authentication via the header `x-admin-key: <ADMIN_API_KEY>`. This allows system developers or testing scripts to bypass JWT logins when performing automated checks.

### Q9: What is CORS, and why is it configured?
**Answer**: Cross-Origin Resource Sharing (CORS) is a browser security mechanism that restricts web applications from making requests to domain origins other than the one that served the page. We mount `app.use(cors())` to allow the MedPath frontend (e.g., running on port 3000) to safely query the backend API (running on port 5000).

### Q10: How does MedPath implement centralized error handling?
**Answer**: Express captures thrown errors and routes them to the registered error handler middleware:
`app.use(errorHandler);`
This middleware function takes four parameters (`err`, `req`, `res`, `next`). It intercepts all exceptions, logs them to the console, and returns a clean, structured JSON response (`500 Internal Server Error`) instead of crashing the process or leaking trace logs to clients.

### Q11: Explain the difference between `request_activity.log` and `admin_activity.log`.
**Answer**: 
- `request_activity.log` logs public traffic access (e.g. course retrievals or health queries).
- `admin_activity.log` logs administrative login queries and data mutations (POST, PUT, DELETE). This separates security audits from general performance metrics.

### Q12: How are Environment Variables utilized, and why are they important?
**Answer**: Environment variables store runtime configurations (e.g., `PORT`, `DB_PASSWORD`, `JWT_SECRET`) separate from code logic. They prevent hardcoded database passwords, which are security risks, and allow deploying the identical codebase to different staging/production environments.

### Q13: What does the command `git ls-files .env` do, and what should it output?
**Answer**: It queries Git to check if `.env` is tracked in the repository index. It should output an empty string, verifying that our ignore rule in `.gitignore` is successfully preventing confidential keys from being pushed to public repositories.

### Q14: Explain the project directory structure.
**Answer**: 
- `server.js`: Process listener bootstrapper.
- `src/app.js`: Mounting middlewares and routers.
- `src/controllers/`: Route handler controllers resolving logic.
- `src/routes/`: Route pathways definitions.
- `src/models/`: SQL queries interacting with the database.
- `src/data/`: Static fallback mock datasets.

### Q15: What is the purpose of the `/api/docs` endpoint?
**Answer**: It is a self-documenting routing table that returns JSON detailing every active endpoint method, URL format, required headers, request body attributes, and description guidelines to assist developers integrating frontend panels.

### Q16: How is graceful shutdown implemented in `server.js`?
**Answer**: We listen to OS terminate signals (`SIGINT` and `SIGTERM`). When triggered, the server stops accepting new HTTP socket connections, closes the database connection pool cleanly, and then calls `process.exit(0)`.

### Q17: What does `test-final-submission.js` check?
**Answer**: It runs programmatic checks verifying:
1. `.env.example` existence and sanitization (no passwords leaked).
2. Git ignores are configured (`.env`, `node_modules/`, `logs/`).
3. Core scripts exist in `package.json`.
4. The logs folder is writable.
5. Key API endpoint responsiveness.

### Q18: What is the purpose of `/api/frontend/course-tree`?
**Answer**: It returns the nested tree of all courses, semesters, and subjects. It is designed to let the frontend render sidebar trees or navigation panels in a single fetch call instead of resolving nested routes recursively.

### Q19: Explain how `nodemon` is used in development scripts.
**Answer**: Nodemon is a utility that monitors directories for code changes and automatically restarts the Node server process. In `package.json`, it watch-checks `server.js` and the `src/` folder while ignoring `node_modules/`.

### Q20: What are the main benefits of using database connection pools over single client connections?
**Answer**: Single client connections block subsequent queries until execution finishes and drop on timeout. Connection pools manage multiple reusable connections, queue requests if all connections are active, scale dynamic allocations, and handle reconnection resets automatically, increasing performance and stability.
