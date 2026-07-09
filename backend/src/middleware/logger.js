const fs = require("fs");
const path = require("path");

// Ensure logs directory exists
const logDirectory = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}
const logFilePath = path.join(logDirectory, "admin_actions.log");

function logger(req, res, next) {
  const start = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    const method = req.method;
    const url = req.originalUrl || req.url;
    const status = res.statusCode;

    // Route tracking checks
    const pathOnly = url.split("?")[0];
    
    // Check if GET /api/health
    const isGetHealth = (method === "GET" && pathOnly === "/api/health");
    // Check if GET /api/courses
    const isGetCourses = (method === "GET" && pathOnly === "/api/courses");
    // Check if POST /api/auth/admin/login
    const isPostAdminLogin = (method === "POST" && pathOnly === "/api/auth/admin/login");
    
    // Check if PUT/DELETE /api/admin/subjects/:subjectId/resources
    const adminResourceRegex = /^\/api\/admin\/subjects\/[^/]+\/resources$/;
    const isAdminResourceRoute = (method === "PUT" || method === "DELETE") && adminResourceRegex.test(pathOnly);

    const shouldLogConsole = isGetHealth || isGetCourses || isPostAdminLogin || isAdminResourceRoute;

    if (shouldLogConsole) {
      console.log(`[${new Date().toISOString()}] ${method} ${url} - ${status} (${duration}ms)`);
    }

    // Logging to file if admin action
    const isAdminAction = isPostAdminLogin || isAdminResourceRoute;

    if (isAdminAction) {
      let adminIdentifier = "Unknown";
      if (req.user && req.user.username) {
        adminIdentifier = req.user.username;
      } else if (req.body && req.body.username) {
        adminIdentifier = req.body.username;
      } else if (req.headers["x-admin-key"]) {
        adminIdentifier = "admin-api-key";
      }

      const logEntry = `[${new Date().toISOString()}] Admin Action: ${method} ${url} | Status: ${status} | User: ${adminIdentifier} | Duration: ${duration}ms\n`;

      fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
          console.error("Failed to write to admin log file:", err.message);
        }
      });
    }
  });

  next();
}

module.exports = logger;
