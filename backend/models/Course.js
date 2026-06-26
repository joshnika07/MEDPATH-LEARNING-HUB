const connectDB = require('../config/db');
const pool = connectDB.pool;

const Course = {
  find: async () => {
    const [rows] = await pool.query('SELECT * FROM courses');
    return rows;
  },
  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM courses WHERE course_id = ?', [id]);
    return rows[0];
  }
};

module.exports = Course;
