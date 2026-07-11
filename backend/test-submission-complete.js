/**
 * MedPath Learning Hub Backend - Final Submission Complete Verification Suite
 */

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const baseUrl = `http://localhost:${PORT}`;

let passedCount = 0;
let failedCount = 0;

function report(condition, message) {
  if (condition) {
    console.log(`SUBMISSION PASS: ${message}`);
    passedCount++;
  } else {
    console.error(`SUBMISSION FAIL: ${message}`);
    failedCount++;
  }
}

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

async function testEndpoint(name, pathSuffix) {
  const url = `${baseUrl}${pathSuffix}`;
  try {
    const response = await fetch(url);
    const success = response.status === 200;
    report(success, `GET ${pathSuffix}`);
    return success;
  } catch (err) {
    report(false, `GET ${pathSuffix} (Error: ${err.message})`);
    return false;
  }
}

async function runSubmissionVerification() {
  console.log("====================================================");
  console.log("MedPath Backend - Final Complete Submission Verification");
  console.log("====================================================");

  let serverSpawnedInfo = { spawned: false };
  try {
    serverSpawnedInfo = await checkAndStartServer();
  } catch (err) {
    console.error(`[FAIL] Could not verify Submission: ${err.message}`);
    process.exit(1);
  }

  // 1. Verify Endpoints
  console.log("\n1. Verifying API Endpoint Responsiveness...");
  await testEndpoint("GET /api/health", "/api/health");
  await testEndpoint("GET /api/project/summary", "/api/project/summary");
  await testEndpoint("GET /api/docs", "/api/docs");
  await testEndpoint("GET /api/courses", "/api/courses");
  await testEndpoint("GET /api/subjects", "/api/subjects");
  await testEndpoint("GET /api/frontend/course-tree", "/api/frontend/course-tree");
  await testEndpoint("GET /api/search?query=anatomy", "/api/search?query=anatomy");

  // Terminate server early to clean up socket handles
  if (serverSpawnedInfo.spawned && serverSpawnedInfo.child) {
    console.log("\n  [INFO] Terminating programmatically spawned server...");
    serverSpawnedInfo.child.kill();
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // 2. Verify Files
  console.log("\n2. Checking Handover Documentation Files...");
  
  const filesToCheck = [
    { name: "README.md", relPath: "README.md" },
    { name: ".env.example", relPath: ".env.example" },
    { name: "docs/day21-final-backend-submission.md", relPath: path.join("docs", "day21-final-backend-submission.md") },
    { name: "docs/final-backend-project-report.md", relPath: path.join("docs", "final-backend-project-report.md") },
    { name: "docs/backend-submission-index.md", relPath: path.join("docs", "backend-submission-index.md") }
  ];

  for (const file of filesToCheck) {
    const filePath = path.join(__dirname, file.relPath);
    const exists = fs.existsSync(filePath);
    report(exists, `File ${file.name} exists`);
  }

  console.log("\n====================================================");
  console.log(`Summary: Passed ${passedCount}, Failed ${failedCount}`);
  console.log("Final backend submission verification completed.");
  console.log("====================================================");

  if (failedCount > 0) {
    setTimeout(() => process.exit(1), 100);
  } else {
    setTimeout(() => process.exit(0), 100);
  }
}

runSubmissionVerification();
