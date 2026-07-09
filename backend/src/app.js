const express = require("express");
const cors = require("cors");

const courseRoutes = require("./routes/courseRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const adminResourceRoutes = require("./routes/adminResourceRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

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
app.use("/api/admin", adminResourceRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
