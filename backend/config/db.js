const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'medpath_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database Connected Successfully');
    connection.release();
  } catch (error) {
    console.warn(`MySQL Connection Warning: ${error.message}. Running with static mock fallbacks.`);
  }
};

// Attach pool to connection function for use in models
connectDB.pool = pool;

module.exports = connectDB;
