/**
 * Final Submission Verification Suite
 * Programs automated checks for:
 * 1. Environment Configurations (.env vs .env.example)
 * 2. package.json scripts consistency
 * 3. Git exclusion rule enforcement (.env & node_modules checking)
 * 4. Log directory & tracking validation
 * 5. Main API endpoint live status verification
 */

const fs = require("fs");
const path = require("path");
const { execSync, spawn } = require("child_process");

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

let failedChecks = 0;
let passedChecks = 0;

function report(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passedChecks++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failedChecks++;
  }
}

async function verifyEnvironment() {
  console.log("\n1. Verifying Environment Templates & Files...");

  // Check .env.example
  const hasExample = fs.existsSync(path.join(__dirname, ".env.example"));
  report(hasExample, ".env.example template file is present");

  if (hasExample) {
    const content = fs.readFileSync(path.join(__dirname, ".env.example"), "utf8");
    const leaksPassword = content.includes("Srikrishna-963") || content.includes("MedPath@123");
    report(!leaksPassword, ".env.example does not leak local credentials");
  }

  // Check .env config presence
  const hasEnv = fs.existsSync(path.join(__dirname, ".env"));
  report(hasEnv, "Local .env file is present for configuration");
}

async function verifyGitExclusions() {
  console.log("\n2. Verifying Git Exclusion & Ignore Integrity...");

  const hasGitignore = fs.existsSync(path.join(__dirname, ".gitignore"));
  report(hasGitignore, ".gitignore is present");

  if (hasGitignore) {
    const gitignoreContent = fs.readFileSync(path.join(__dirname, ".gitignore"), "utf8");
    
    report(gitignoreContent.includes(".env"), ".gitignore ignores .env files");
    report(gitignoreContent.includes("node_modules/"), ".gitignore ignores node_modules/");
    report(gitignoreContent.includes("logs/"), ".gitignore ignores logs/");
  }

  // Programmatically check if .env is currently tracked by git
  try {
    const trackedFiles = execSync("git ls-files .env", { stdio: "pipe" }).toString().trim();
    report(trackedFiles === "", "Git is NOT tracking the local .env configuration file");
  } catch (err) {
    console.log("  [INFO] Git is not initialized or not accessible in CLI. Skipping Git tracking check.");
  }
}

async function verifyPackageScripts() {
  console.log("\n3. Verifying package.json Scripts...");

  const hasPackageJson = fs.existsSync(path.join(__dirname, "package.json"));
  report(hasPackageJson, "package.json exists");

  if (hasPackageJson) {
    const pkg = require("./package.json");
    report(!!pkg.scripts, "package.json has a scripts object defined");

    if (pkg.scripts) {
      report(!!pkg.scripts.start, "Script 'start' exists");
      report(!!pkg.scripts.dev, "Script 'dev' exists");
      report(pkg.scripts.seed, "Script 'seed' exists");
      report(!!pkg.scripts["final-check"], "Script 'final-check' exists");
    }
  }
}

async function verifyApiEndpoints() {
  console.log("\n5. Validating Key API Endpoint Responsiveness...");

  const endpoints = [
    { name: "GET /api/health", path: "/api/health" },
    { name: "GET /api/docs", path: "/api/docs" },
    { name: "GET /api/courses", path: "/api/courses" },
    { name: "GET /api/subjects", path: "/api/subjects" }
  ];

  for (const endpoint of endpoints) {
    const url = `${baseUrl}${endpoint.path}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      const isSuccess = response.status === 200 && (data.success === true || data.status === "OK");
      report(isSuccess, `${endpoint.name} (${endpoint.path}) is responsive and returned status 200`);
    } catch (error) {
      report(false, `${endpoint.name} (${endpoint.path}) is offline or threw an error: ${error.message}`);
    }
  }
}

async function verifyLoggingAndDirectories() {
  console.log("\n4. Checking Log Systems & Directory Privileges...");

  const logsDir = path.join(__dirname, "logs");
  const hasLogs = fs.existsSync(logsDir);
  report(hasLogs, "logs/ directory exists");

  if (hasLogs) {
    const testFile = path.join(logsDir, ".submission-check-write");
    try {
      fs.writeFileSync(testFile, "check");
      fs.unlinkSync(testFile);
      report(true, "logs/ directory is writable");
    } catch (err) {
      report(false, `logs/ directory write permissions failed: ${err.message}`);
    }
  }
}

async function runFinalChecks() {
  console.log("====================================================");
  console.log("MedPath Backend - Final Submission Verification Suite");
  console.log("====================================================");

  let serverSpawnedInfo = { spawned: false };
  try {
    serverSpawnedInfo = await checkAndStartServer();
  } catch (err) {
    console.error(`  [FAIL] Could not verify API endpoints: ${err.message}`);
    failedChecks++;
  }

  await verifyEnvironment();
  await verifyGitExclusions();
  await verifyPackageScripts();
  await verifyLoggingAndDirectories();
  await verifyApiEndpoints();

  if (serverSpawnedInfo.spawned && serverSpawnedInfo.child) {
    console.log("  [INFO] Terminating programmatically spawned server...");
    serverSpawnedInfo.child.kill();
    // Wait a brief moment to let server exit clean
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log("\n====================================================");
  console.log("Verification Summary:");
  console.log(`  Passed Checks: ${passedChecks}`);
  console.log(`  Failed Checks: ${failedChecks}`);
  console.log("====================================================");

  if (failedChecks > 0) {
    console.error("\n[STATUS] Verification FAILED. Please resolve the issues before submission.");
    process.exit(1);
  } else {
    console.log("\n[STATUS] All verification checks PASSED. Ready for final Git submission!");
    process.exit(0);
  }
}

runFinalChecks();
