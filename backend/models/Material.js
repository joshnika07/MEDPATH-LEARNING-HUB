const connectDB = require('../config/db');
const pool = connectDB.pool;

const Material = {
  findBySubjectId: async (subjectId) => {
    const [rows] = await pool.query('SELECT * FROM materials WHERE subject_id = ?', [subjectId]);
    return rows;
  }
};

module.exports = Material;
