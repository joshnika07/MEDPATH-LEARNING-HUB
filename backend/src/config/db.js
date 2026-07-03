const dotenv = require("dotenv");

dotenv.config();

let mysql;
try {
  mysql = require("mysql2/promise");
} catch (error) {
  console.warn("mysql2 package is not installed. Database queries will fall back to static mock data.");
}

let pool = null;
let isConnected = false;

if (mysql) {
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "medpath_learning_hub",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

const connectDB = async () => {
  if (!pool) {
    return null;
  }
  try {
    const connection = await pool.getConnection();
    console.log("Database Connected Successfully");
    isConnected = true;
    connection.release();
    return pool;
  } catch (error) {
    console.warn(`MySQL Connection Warning: ${error.message}. Running with static mock fallbacks.`);
    isConnected = false;
    return null;
  }
};

// Initialize connection test asynchronously
connectDB();

// Attach helper functions
connectDB.pool = pool;
connectDB.getPool = async () => {
  if (!pool) return null;
  if (!isConnected) {
    try {
      const connection = await pool.getConnection();
      isConnected = true;
      connection.release();
    } catch (error) {
      isConnected = false;
    }
  }
  return isConnected ? pool : null;
};

module.exports = connectDB;
