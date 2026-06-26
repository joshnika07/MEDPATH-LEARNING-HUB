// Placeholder controller for materials

// GET /api/materials
exports.getMaterials = async (req, res) => {
  try {
    res.status(200).send('GET /materials placeholder');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/materials
exports.createMaterial = async (req, res) => {
  try {
    res.status(201).send('POST /materials placeholder');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
