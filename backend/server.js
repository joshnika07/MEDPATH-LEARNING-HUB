const express = require("express");
const cors = require("cors");
const app = express();

const courseRoutes = require("./routes/courseRoutes");

app.use(cors());
app.use(express.json());

// Mount API routes
app.use("/api", courseRoutes);

app.get("/", (req, res) => {
    res.send("MedPath Backend is Running");
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
