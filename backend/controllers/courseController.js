// Placeholder controller for Courses
exports.getCourses = async (req, res) => {
  try {
    const courses = [
      { id: 1, name: "B.Pharm" },
      { id: 2, name: "B.Sc Nursing" },
      { id: 3, name: "GNM Nursing" }
    ];
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    res.status(200).json({ message: `Get course details for ID ${req.params.id}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
