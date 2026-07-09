/**
 * MedPath Learning Hub Backend - Demo Flow Verification Suite
 */

const path = require("path");
const { spawn } = require("child_process");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const baseUrl = `http://localhost:${PORT}`;

async function isPortResponsive(port) {
  try {
    const res = await fetch(`http://localhost:${port}/api/health`);
    return res.status === 200;
  } catch (err) {
    return false;
  }
}

async function checkAndStartServer() {
  const isRunning = await isPortResponsive(PORT);
  if (isRunning) {
    console.log(`  [INFO] Server is already running on port ${PORT}.`);
    return { spawned: false };
  }

  console.log(`  [INFO] Server is not running. Spawning backend server on port ${PORT}...`);
  const child = spawn(process.execPath, [path.join(__dirname, "server.js")], {
    env: { ...process.env, PORT: PORT.toString() },
    stdio: "ignore",
    detached: false
  });

  let retries = 30;
  while (retries > 0) {
    const alive = await isPortResponsive(PORT);
    if (alive) {
      console.log(`  [INFO] Server spawned successfully and is responsive.`);
      return { spawned: true, child };
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
    retries--;
  }

  child.kill();
  throw new Error("Failed to start the backend server programmatically.");
}

async function testEndpoint(name, url, options = {}) {
  try {
    const response = await fetch(url, options);
    const success = response.status === 200;
    if (success) {
      console.log(`DEMO PASS: ${name}`);
      return true;
    } else {
      console.error(`DEMO FAIL: ${name} (Status: ${response.status})`);
      return false;
    }
  } catch (err) {
    console.error(`DEMO FAIL: ${name} (Error: ${err.message})`);
    return false;
  }
}

async function runDemoFlow() {
  console.log("=========================================");
  console.log("Starting Backend Demo Flow API Verifications...");
  console.log("=========================================");

  let serverSpawnedInfo = { spawned: false };
  try {
    serverSpawnedInfo = await checkAndStartServer();
  } catch (err) {
    console.error(`[FAIL] Could not verify Demo Flow: ${err.message}`);
    process.exit(1);
  }

  let allPassed = true;

  // 1. GET /api/health
  allPassed = (await testEndpoint("GET /api/health", `${baseUrl}/api/health`)) && allPassed;

  // 2. GET /api/project/summary
  allPassed = (await testEndpoint("GET /api/project/summary", `${baseUrl}/api/project/summary`)) && allPassed;

  // 3. GET /api/docs
  allPassed = (await testEndpoint("GET /api/docs", `${baseUrl}/api/docs`)) && allPassed;

  // 4. GET /api/courses
  allPassed = (await testEndpoint("GET /api/courses", `${baseUrl}/api/courses`)) && allPassed;

  // 5. GET /api/subjects
  allPassed = (await testEndpoint("GET /api/subjects", `${baseUrl}/api/subjects`)) && allPassed;

  // 6. GET /api/frontend/course-tree
  allPassed = (await testEndpoint("GET /api/frontend/course-tree", `${baseUrl}/api/frontend/course-tree`)) && allPassed;

  // 7. GET /api/search?query=anatomy
  allPassed = (await testEndpoint("GET /api/search?query=anatomy", `${baseUrl}/api/search?query=anatomy`)) && allPassed;

  // 8. POST /api/auth/admin/login
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "MedPath@123";
  allPassed = (await testEndpoint("POST /api/auth/admin/login", `${baseUrl}/api/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })) && allPassed;

  // 9. GET /api/admin/logs/requests using x-admin-key
  const adminApiKey = process.env.ADMIN_API_KEY || "medpath-admin-123";
  allPassed = (await testEndpoint("GET /api/admin/logs/requests using x-admin-key", `${baseUrl}/api/admin/logs/requests`, {
    headers: { "x-admin-key": adminApiKey }
  })) && allPassed;

  if (serverSpawnedInfo.spawned && serverSpawnedInfo.child) {
    console.log("  [INFO] Terminating programmatically spawned server...");
    serverSpawnedInfo.child.kill();
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log("=========================================");
  if (allPassed) {
    console.log("Backend demo flow completed.");
    setTimeout(() => process.exit(0), 100);
  } else {
    console.error("Backend demo flow completed with failures.");
    setTimeout(() => process.exit(1), 100);
  }
}

runDemoFlow();
