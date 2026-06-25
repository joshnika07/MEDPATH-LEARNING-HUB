const express = require("express");
const router = express.Router();

router.get("/courses", (req, res) => {
    res.json([
        "B.Pharm",
        "B.Sc Nursing",
        "GNM Nursing"
    ]);
});

module.exports = router;
