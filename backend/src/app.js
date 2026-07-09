const express = require("express");
const cors = require("cors");

const courseRoutes = require("./routes/courseRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const adminResourceRoutes = require("./routes/adminResourceRoutes");
const jwtAuth = require("./middleware/jwtAuth");
const authRoutes = require("./routes/authRoutes");
const requestLogger = require("./middleware/requestLogger");
const adminActivityLogger = require("./middleware/adminActivityLogger");
const logRoutes = require("./routes/logRoutes");
const apiDocsRoutes = require("./routes/apiDocsRoutes");
const projectSummaryRoutes = require("./routes/projectSummaryRoutes");
const frontendRoutes = require("./routes/frontendRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(adminActivityLogger);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to MedPath Learning Hub Backend API"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    service: "MedPath Learning Hub Backend"
  });
});

app.use("/api/courses", courseRoutes);
app.use("/api", subjectRoutes);
app.use("/api", resourceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", apiDocsRoutes);
app.use("/api", projectSummaryRoutes);
app.use("/api/frontend", frontendRoutes);
app.use("/api/admin", jwtAuth, adminResourceRoutes);
app.use("/api/admin", jwtAuth, logRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
