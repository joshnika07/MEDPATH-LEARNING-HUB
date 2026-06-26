const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

// GET /api/materials
router.get('/materials', materialController.getMaterials);

// POST /api/materials
router.post('/materials', materialController.createMaterial);

module.exports = router;
