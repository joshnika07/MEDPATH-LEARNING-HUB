const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');

router.get('/:courseId', subjectController.getSubjectsByCourse);

module.exports = router;
