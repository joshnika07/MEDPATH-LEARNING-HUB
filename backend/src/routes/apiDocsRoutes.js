const express = require("express");
const router = express.Router();
const { getApiDocs } = require("../controllers/apiDocsController");

router.get("/docs", getApiDocs);

module.exports = router;
