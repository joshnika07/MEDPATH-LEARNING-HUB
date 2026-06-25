// Placeholder controller for Subjects
exports.getSubjectsByCourse = async (req, res) => {
  try {
    res.status(200).json({ message: `Get subjects for course ID ${req.params.courseId}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
