const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');

// GET /api/subjects
router.get('/subjects', subjectController.getSubjects);

// POST /api/subjects
router.post('/subjects', subjectController.createSubject);

module.exports = router;
