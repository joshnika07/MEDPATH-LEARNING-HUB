const connectDB = require('../config/db');
const pool = connectDB.pool;

const Subject = {
  find: async () => {
    const [rows] = await pool.query('SELECT * FROM subjects');
    return rows;
  },
  findByCourseId: async (courseId) => {
    const [rows] = await pool.query('SELECT * FROM subjects WHERE course_id = ?', [courseId]);
    return rows;
  }
};

module.exports = Subject;
