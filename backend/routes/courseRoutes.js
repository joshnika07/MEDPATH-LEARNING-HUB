const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// GET /api/courses
router.get('/courses', courseController.getCourses);

// POST /api/courses
router.post('/courses', courseController.createCourse);

module.exports = router;
