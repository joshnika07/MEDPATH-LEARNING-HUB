require("dotenv").config();

const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Startup procedure
async function startServer() {
  try {
    console.log("Initializing database connection...");
    const pool = await connectDB();
    if (pool) {
      console.log("Database connection established.");
    } else {
      console.warn("WARNING: Database connection failed. Running in static mock fallback mode.");
    }

    server.listen(PORT, () => {
      console.log(`MedPath backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Critical error during server initialization:", error);
    process.exit(1);
  }
}

// Graceful shutdown handling
async function gracefulShutdown(signal) {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

  // Stop accepting new HTTP requests
  server.close(async () => {
    console.log("HTTP server closed.");

    // Close database connection pool
    try {
      const pool = connectDB.pool;
      if (pool) {
        console.log("Closing database connection pool...");
        await pool.end();
        console.log("Database pool closed.");
      }
    } catch (err) {
      console.error("Error closing database connection pool:", err);
    }

    console.log("Graceful shutdown completed. Exiting process.");
    process.exit(0);
  });

  // Force close after 10s timeout
  setTimeout(() => {
    console.error("Forcing shutdown after timeout.");
    process.exit(1);
  }, 10000);
}

// Intercept process event listeners
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Do not exit unless desired, but log it clearly
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception thrown:", error);
  // Exit gracefully since application state is now undefined
  gracefulShutdown("uncaughtException");
});

startServer();