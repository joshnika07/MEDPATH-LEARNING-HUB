const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Import route modules
const courseRoutes = require("./routes/courseRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const materialRoutes = require("./routes/materialRoutes");

// Mount routes under /api
app.use("/api", courseRoutes);
app.use("/api", subjectRoutes);
app.use("/api", materialRoutes);

// Basic static route
app.get("/api/courses-static", (req, res) => {
  res.json([
    { id: 1, name: "B.Pharm" },
    { id: 2, name: "B.Sc Nursing" },
    { id: 3, name: "GNM Nursing" }
  ]);
});

app.get("/", (req, res) => {
    res.send("MedPath Learning Hub Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});
