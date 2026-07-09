const fs = require("fs");
const path = require("path");

const logDirectory = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}
const logFilePath = path.join(logDirectory, "request_activity.log");

function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const method = req.method;
    const url = req.originalUrl || req.url;
    const status = res.statusCode;

    const pathOnly = url.split("?")[0];
    
    // Track health and courses endpoints
    const isTracked = 
      (method === "GET" && pathOnly === "/api/health") ||
      (method === "GET" && pathOnly === "/api/courses");

    if (isTracked) {
      const logMsg = `[${new Date().toISOString()}] ${method} ${url} - ${status} (${duration}ms)`;
      // 1. Log to console
      console.log(logMsg);

      // 2. Log to file
      const logEntry = `${logMsg}\n`;
      fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
          console.error("Failed to write to request activity log file:", err.message);
        }
      });
    }
  });

  next();
}

module.exports = requestLogger;
