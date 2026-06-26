// Placeholder controller for subjects

// GET /api/subjects
exports.getSubjects = async (req, res) => {
  try {
    res.status(200).send('GET /subjects placeholder');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/subjects
exports.createSubject = async (req, res) => {
  try {
    res.status(201).send('POST /subjects placeholder');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
