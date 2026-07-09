const fs = require("fs");
const path = require("path");

const requestLogFilePath = path.join(__dirname, "../../logs/request_activity.log");
const adminActivityLogFilePath = path.join(__dirname, "../../logs/admin_activity.log");

async function getRequestLogs(req, res) {
  try {
    if (!fs.existsSync(requestLogFilePath)) {
      return res.status(200).json({
        success: true,
        message: "No request logs found",
        logs: []
      });
    }

    const data = fs.readFileSync(requestLogFilePath, "utf8");
    const lines = data.split("\n").filter(line => line.trim().length > 0);

    res.status(200).json({
      success: true,
      count: lines.length,
      logs: lines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve request logs",
      error: error.message
    });
  }
}

async function getAdminActivityLogs(req, res) {
  try {
    if (!fs.existsSync(adminActivityLogFilePath)) {
      return res.status(200).json({
        success: true,
        message: "No admin activity logs found",
        logs: []
      });
    }

    const data = fs.readFileSync(adminActivityLogFilePath, "utf8");
    const lines = data.split("\n").filter(line => line.trim().length > 0);

    res.status(200).json({
      success: true,
      count: lines.length,
      logs: lines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve admin activity logs",
      error: error.message
    });
  }
}

module.exports = {
  getRequestLogs,
  getAdminActivityLogs
};
