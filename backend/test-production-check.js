/**
 * Production Check Verification Script
 * Checks key endpoints of the application:
 * - GET /api/health
 * - GET /api/docs
 * - GET /api/courses
 * - GET /api/subjects
 * Prints PASS or FAIL for each API.
 */

const PORT = process.env.PORT || 5000;
const baseUrl = `http://localhost:${PORT}`;

async function testEndpoint(name, path) {
  const url = `${baseUrl}${path}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Validate standard response patterns (200 status and success: true/OK health status)
    const isSuccess = response.status === 200 && (data.success === true || data.status === "OK");
    
    if (isSuccess) {
      console.log(`[PASS] ${name} (${path})`);
      return true;
    } else {
      console.error(`[FAIL] ${name} (${path}) - Status: ${response.status}, Success Flag: ${data.success}`);
      return false;
    }
  } catch (error) {
    console.error(`[FAIL] ${name} (${path}) - Connection Error: ${error.message}`);
    return false;
  }
}

async function runProductionChecks() {
  console.log("========================================");
  console.log("Running Production Readiness API Checks...");
  console.log("========================================");

  const results = [];

  results.push(await testEndpoint("GET /api/health", "/api/health"));
  results.push(await testEndpoint("GET /api/docs", "/api/docs"));
  results.push(await testEndpoint("GET /api/courses", "/api/courses"));
  results.push(await testEndpoint("GET /api/subjects", "/api/subjects"));

  console.log("========================================");
  const allPassed = results.every(res => res === true);
  if (allPassed) {
    console.log("All production checks PASSED!");
    process.exit(0);
  } else {
    console.error("Some production checks FAILED!");
    process.exit(1);
  }
}

runProductionChecks();
