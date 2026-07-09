/**
 * MedPath Learning Hub Backend - Deployment Readiness Checks
 * Programmatically validates configurations, scripts, ignores, and structure.
 */

const fs = require("fs");
const path = require("path");

let failedCount = 0;
let passedCount = 0;

function report(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failedCount++;
  }
}

async function runReadinessChecks() {
  console.log("========================================");
  console.log("Running Deployment Readiness Checks...");
  console.log("========================================");

  // 1. package.json exists
  const packageJsonPath = path.join(__dirname, "package.json");
  const hasPackageJson = fs.existsSync(packageJsonPath);
  report(hasPackageJson, "package.json exists");

  let pkg = {};
  if (hasPackageJson) {
    try {
      pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    } catch (e) {
      report(false, `package.json parsing error: ${e.message}`);
    }
  }

  // 2-4. package.json scripts
  if (hasPackageJson && pkg.scripts) {
    report(!!pkg.scripts.start, "package.json has start script");
    report(!!pkg.scripts.dev, "package.json has dev script");
    report(!!pkg.scripts["final-check"], "package.json has final-check script");
  } else {
    report(false, "package.json start script exists");
    report(false, "package.json dev script exists");
    report(false, "package.json final-check script exists");
  }

  // 5. .env.example exists
  const envExamplePath = path.join(__dirname, ".env.example");
  report(fs.existsSync(envExamplePath), ".env.example exists");

  // 6. README.md exists
  const readmePath = path.join(__dirname, "README.md");
  report(fs.existsSync(readmePath), "README.md exists");

  // 7. server.js exists
  const serverPath = path.join(__dirname, "server.js");
  const hasServer = fs.existsSync(serverPath);
  report(hasServer, "server.js exists");

  // 8. server.js uses process.env.PORT
  if (hasServer) {
    const serverContent = fs.readFileSync(serverPath, "utf8");
    const usesPortEnv = serverContent.includes("process.env.PORT");
    report(usesPortEnv, "server.js uses process.env.PORT");
  } else {
    report(false, "server.js uses process.env.PORT");
  }

  // 9. .gitignore exists
  const gitignorePath = path.join(__dirname, ".gitignore");
  const hasGitignore = fs.existsSync(gitignorePath);
  report(hasGitignore, ".gitignore exists");

  // 10-11. .gitignore checks
  if (hasGitignore) {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
    report(gitignoreContent.includes(".env"), ".gitignore contains .env");
    report(gitignoreContent.includes("node_modules"), ".gitignore contains node_modules");
  } else {
    report(false, ".gitignore contains .env");
    report(false, ".gitignore contains node_modules");
  }

  // 12. docs folder exists
  const docsPath = path.join(__dirname, "docs");
  const hasDocs = fs.existsSync(docsPath) && fs.statSync(docsPath).isDirectory();
  report(hasDocs, "docs folder exists");

  console.log("========================================");
  console.log(`Summary: Passed ${passedCount}, Failed ${failedCount}`);
  console.log("Deployment readiness check completed.");
  console.log("========================================");

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runReadinessChecks();
