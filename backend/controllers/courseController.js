// Placeholder controller for courses

// GET /api/courses
exports.getCourses = async (req, res) => {
  try {
    res.status(200).send('GET /courses placeholder');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/courses
exports.createCourse = async (req, res) => {
  try {
    res.status(201).send('POST /courses placeholder');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
