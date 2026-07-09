const fs = require("fs");
const path = require("path");

const logDirectory = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}
const logFilePath = path.join(logDirectory, "admin_activity.log");

function adminActivityLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const method = req.method;
    const url = req.originalUrl || req.url;
    const status = res.statusCode;

    const pathOnly = url.split("?")[0];

    // Admin login path
    const isPostAdminLogin = (method === "POST" && pathOnly === "/api/auth/admin/login");
    
    // Admin resource paths (PUT or DELETE /api/admin/subjects/:subjectId/resources)
    const adminResourceRegex = /^\/api\/admin\/subjects\/[^/]+\/resources$/;
    const isAdminResourceRoute = (method === "PUT" || method === "DELETE") && adminResourceRegex.test(pathOnly);

    if (isPostAdminLogin || isAdminResourceRoute) {
      // 1. Log to console
      console.log(`[${new Date().toISOString()}] ADMIN ACTION: ${method} ${url} - ${status} (${duration}ms)`);

      // 2. Identify the user performing the action
      let adminIdentifier = "Unknown";
      if (req.user && req.user.username) {
        adminIdentifier = req.user.username;
      } else if (req.body && req.body.username) {
        adminIdentifier = req.body.username;
      } else if (req.headers["x-admin-key"]) {
        adminIdentifier = "admin-api-key";
      }

      // 3. Log to file
      const logEntry = `[${new Date().toISOString()}] Admin Action: ${method} ${url} | Status: ${status} | User: ${adminIdentifier} | Duration: ${duration}ms\n`;

      fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
          console.error("Failed to write to admin activity log file:", err.message);
        }
      });
    }
  });

  next();
}

module.exports = adminActivityLogger;
