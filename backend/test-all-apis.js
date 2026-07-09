/**
 * Comprehensive API Test Suite
 * Tests all endpoints of the MedPath Learning Hub Backend API.
 * Assumes the backend server is running on http://localhost:5000.
 */

const baseUrl = "http://localhost:5000";

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    testsPassed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    testsFailed++;
  }
}

async function testGeneralEndpoints() {
  console.log("\n--- Testing General Endpoints ---");

  // 1. GET /
  try {
    const res = await fetch(`${baseUrl}/`);
    const data = await res.json();
    assert(res.status === 200, "GET / returns status 200");
    assert(data.success === true, "GET / returns success: true");
    assert(data.message && data.message.includes("MedPath"), "GET / returns correct message");
  } catch (err) {
    assert(false, `GET / failed: ${err.message}`);
  }

  // 2. GET /api/health
  try {
    const res = await fetch(`${baseUrl}/api/health`);
    const data = await res.json();
    assert(res.status === 200, "GET /api/health returns status 200");
    assert(data.status === "OK", "GET /api/health returns status: OK");
  } catch (err) {
    assert(false, `GET /api/health failed: ${err.message}`);
  }

  // 3. GET /api/docs (New endpoint)
  try {
    const res = await fetch(`${baseUrl}/api/docs`);
    const data = await res.json();
    assert(res.status === 200, "GET /api/docs returns status 200");
    assert(data.success === true, "GET /api/docs returns success: true");
    assert(data.data && data.data.title === "MedPath Learning Hub API Documentation", "GET /api/docs returns correct title");
    assert(data.data.endpoints && data.data.endpoints.length > 0, "GET /api/docs returns endpoints array");
  } catch (err) {
    assert(false, `GET /api/docs failed: ${err.message}`);
  }
}

async function testCourseEndpoints() {
  console.log("\n--- Testing Course Endpoints ---");

  // 1. GET /api/courses
  try {
    const res = await fetch(`${baseUrl}/api/courses`);
    const data = await res.json();
    assert(res.status === 200, "GET /api/courses returns status 200");
    assert(data.success === true, "GET /api/courses returns success: true");
    assert(Array.isArray(data.data), "GET /api/courses returns data array");
  } catch (err) {
    assert(false, `GET /api/courses failed: ${err.message}`);
  }

  // 2. GET /api/courses/:courseId
  try {
    const res = await fetch(`${baseUrl}/api/courses/bpharm`);
    const data = await res.json();
    assert(res.status === 200, "GET /api/courses/bpharm returns status 200");
    assert(data.success === true, "GET /api/courses/bpharm returns success: true");
    assert(data.data && data.data.id === "bpharm", "GET /api/courses/bpharm returns correct course");
  } catch (err) {
    assert(false, `GET /api/courses/:courseId failed: ${err.message}`);
  }

  // 3. GET /api/courses/:courseId/semesters
  try {
    const res = await fetch(`${baseUrl}/api/courses/bpharm/semesters`);
    const data = await res.json();
    assert(res.status === 200, "GET /api/courses/bpharm/semesters returns status 200");
    assert(data.success === true, "GET /api/courses/bpharm/semesters returns success: true");
    assert(Array.isArray(data.data), "GET /api/courses/bpharm/semesters returns data array");
  } catch (err) {
    assert(false, `GET /api/courses/:courseId/semesters failed: ${err.message}`);
  }

  // 4. GET /api/courses/:courseId/subjects
  try {
    const res = await fetch(`${baseUrl}/api/courses/bpharm/subjects`);
    const data = await res.json();
    assert(res.status === 200, "GET /api/courses/bpharm/subjects returns status 200");
    assert(data.success === true, "GET /api/courses/bpharm/subjects returns success: true");
    assert(Array.isArray(data.data), "GET /api/courses/bpharm/subjects returns data array");
  } catch (err) {
    assert(false, `GET /api/courses/:courseId/subjects failed: ${err.message}`);
  }

  // 5. GET /api/courses/:courseId/semesters/:semesterId/subjects
  try {
    const res = await fetch(`${baseUrl}/api/courses/bpharm/semesters/bpharm-sem-1/subjects`);
    const data = await res.json();
    assert(res.status === 200, "GET /api/courses/bpharm/semesters/bpharm-sem-1/subjects returns status 200");
    assert(data.success === true, "GET /api/courses/bpharm/semesters/bpharm-sem-1/subjects returns success: true");
    assert(Array.isArray(data.data), "GET /api/courses/bpharm/semesters/bpharm-sem-1/subjects returns data array");
  } catch (err) {
    assert(false, `GET /api/courses/:courseId/semesters/:semesterId/subjects failed: ${err.message}`);
  }
}

async function testSubjectAndResourceEndpoints() {
  console.log("\n--- Testing Subject & Resource Endpoints ---");
  const subjectId = "bpharm-sem-1-human-anatomy-and-physiology";

  // 1. GET /api/subjects
  try {
    const res = await fetch(`${baseUrl}/api/subjects`);
    const data = await res.json();
    assert(res.status === 200, "GET /api/subjects returns status 200");
    assert(data.success === true, "GET /api/subjects returns success: true");
    assert(Array.isArray(data.data), "GET /api/subjects returns data array");
  } catch (err) {
    assert(false, `GET /api/subjects failed: ${err.message}`);
  }

  // 2. GET /api/subjects/:subjectId
  try {
    const res = await fetch(`${baseUrl}/api/subjects/${subjectId}`);
    const data = await res.json();
    assert(res.status === 200, `GET /api/subjects/${subjectId} returns status 200`);
    assert(data.success === true, `GET /api/subjects/${subjectId} returns success: true`);
    assert(data.data && data.data.subject && data.data.subject.id === subjectId, "Returns correct subject nested info");
  } catch (err) {
    assert(false, `GET /api/subjects/:subjectId failed: ${err.message}`);
  }

  // 3. GET /api/search
  try {
    const res = await fetch(`${baseUrl}/api/search?query=anatomy`);
    const data = await res.json();
    assert(res.status === 200, "GET /api/search?query=anatomy returns status 200");
    assert(data.success === true, "GET /api/search?query=anatomy returns success: true");
    assert(Array.isArray(data.data), "GET /api/search?query=anatomy returns results array");
  } catch (err) {
    assert(false, `GET /api/search failed: ${err.message}`);
  }

  // 4. Resource sub-resources
  const resources = ["resources", "syllabus", "materials", "important-topics", "videos", "practicals", "learning-process"];
  for (const resource of resources) {
    try {
      const res = await fetch(`${baseUrl}/api/subjects/${subjectId}/${resource}`);
      const data = await res.json();
      assert(res.status === 200, `GET /api/subjects/${subjectId}/${resource} returns status 200`);
      assert(data.success === true, `GET /api/subjects/${subjectId}/${resource} returns success: true`);
    } catch (err) {
      assert(false, `GET /api/subjects/${subjectId}/${resource} failed: ${err.message}`);
    }
  }
}

async function testAuthAndAdminEndpoints() {
  console.log("\n--- Testing Auth & Admin Endpoints ---");
  const subjectId = "bpharm-sem-1-human-anatomy-and-physiology";

  // 1. Admin login with invalid credentials
  try {
    const res = await fetch(`${baseUrl}/api/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "wrong", password: "user" })
    });
    const data = await res.json();
    assert(res.status === 401, "POST /api/auth/admin/login with invalid creds returns 401");
    assert(data.success === false, "POST /api/auth/admin/login with invalid creds returns success: false");
  } catch (err) {
    assert(false, `POST /api/auth/admin/login (invalid creds) failed: ${err.message}`);
  }

  // 2. Admin login with valid credentials
  let token = "";
  try {
    const res = await fetch(`${baseUrl}/api/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "MedPath@123" })
    });
    const data = await res.json();
    assert(res.status === 200, "POST /api/auth/admin/login with valid creds returns 200");
    assert(data.success === true, "POST /api/auth/admin/login with valid creds returns success: true");
    assert(!!data.token, "POST /api/auth/admin/login returns a token");
    token = data.token;
  } catch (err) {
    assert(false, `POST /api/auth/admin/login (valid creds) failed: ${err.message}`);
  }

  // 3. Unauthorized access to admin endpoints
  try {
    const res = await fetch(`${baseUrl}/api/admin/subjects/${subjectId}/resources`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ syllabusUnits: ["Unit Test 1"] })
    });
    assert(res.status === 401, "PUT /api/admin/subjects/:subjectId/resources without auth returns 401");
  } catch (err) {
    assert(false, `PUT /api/admin/... without auth failed: ${err.message}`);
  }

  // 4. Clean up / Reset resource (accept 200 or 404)
  try {
    const res = await fetch(`${baseUrl}/api/admin/subjects/${subjectId}/resources`, {
      method: "DELETE",
      headers: { "x-admin-key": "medpath-admin-123" }
    });
    assert(res.status === 200 || res.status === 404, "DELETE /api/admin/subjects/:subjectId/resources prepares clean state");
  } catch (err) {
    assert(false, `DELETE /api/admin/... cleanup failed: ${err.message}`);
  }

  // 5. POST new resources (Expect 201)
  try {
    const res = await fetch(`${baseUrl}/api/admin/subjects/${subjectId}/resources`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": "medpath-admin-123"
      },
      body: JSON.stringify({
        syllabusUnits: ["Unit 1: Original Anatomy"],
        studyMaterials: ["Original Material PDF"]
      })
    });
    assert(res.status === 201, "POST /api/admin/subjects/:subjectId/resources returns 201");
  } catch (err) {
    assert(false, `POST /api/admin/... failed: ${err.message}`);
  }

  // 6. Authorized access PUT with JWT Bearer token
  if (token) {
    try {
      const res = await fetch(`${baseUrl}/api/admin/subjects/${subjectId}/resources`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          syllabusUnits: ["Unit 1: Anatomy Updated by Test"],
          studyMaterials: ["Material Test Updated by Test"] 
        })
      });
      const data = await res.json();
      assert(res.status === 200, "PUT /api/admin/subjects/:subjectId/resources with JWT token returns 200");
      assert(data.success === true, "PUT /api/admin/subjects/:subjectId/resources with JWT token returns success: true");
    } catch (err) {
      assert(false, `PUT /api/admin/... with JWT failed: ${err.message}`);
    }
  } else {
    assert(false, "Skipping JWT authorization tests because login token is empty");
  }

  // 7. Authorized access PUT with x-admin-key fallback
  try {
    const res = await fetch(`${baseUrl}/api/admin/subjects/${subjectId}/resources`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "x-admin-key": "medpath-admin-123"
      },
      body: JSON.stringify({ 
        syllabusUnits: ["Unit 1: Anatomy Updated by API Key"],
        studyMaterials: ["Material Test Updated by API Key"] 
      })
    });
    const data = await res.json();
    assert(res.status === 200, "PUT /api/admin/subjects/:subjectId/resources with x-admin-key returns 200");
    assert(data.success === true, "PUT /api/admin/subjects/:subjectId/resources with x-admin-key returns success: true");
  } catch (err) {
    assert(false, `PUT /api/admin/... with API key failed: ${err.message}`);
  }

  // 8. DELETE resources cleanup
  try {
    const res = await fetch(`${baseUrl}/api/admin/subjects/${subjectId}/resources`, {
      method: "DELETE",
      headers: { "x-admin-key": "medpath-admin-123" }
    });
    const data = await res.json();
    assert(res.status === 200, "DELETE /api/admin/subjects/:subjectId/resources with x-admin-key returns 200");
    assert(data.success === true, "DELETE /api/admin/subjects/:subjectId/resources returns success: true");
  } catch (err) {
    assert(false, `DELETE /api/admin/... final cleanup failed: ${err.message}`);
  }

  // 9. Logs endpoints (Authorized)
  try {
    const res = await fetch(`${baseUrl}/api/admin/logs/requests`, {
      headers: { "x-admin-key": "medpath-admin-123" }
    });
    const data = await res.json();
    assert(res.status === 200, "GET /api/admin/logs/requests with x-admin-key returns 200");
    assert(data.success === true, "GET /api/admin/logs/requests returns success: true");
    assert(Array.isArray(data.logs), "GET /api/admin/logs/requests returns log entries array");
  } catch (err) {
    assert(false, `GET /api/admin/logs/requests failed: ${err.message}`);
  }

  try {
    const res = await fetch(`${baseUrl}/api/admin/logs/activities`, {
      headers: { "x-admin-key": "medpath-admin-123" }
    });
    const data = await res.json();
    assert(res.status === 200, "GET /api/admin/logs/activities with x-admin-key returns 200");
    assert(data.success === true, "GET /api/admin/logs/activities returns success: true");
    assert(Array.isArray(data.logs), "GET /api/admin/logs/activities returns log entries array");
  } catch (err) {
    assert(false, `GET /api/admin/logs/activities failed: ${err.message}`);
  }
}

async function runAllTests() {
  console.log("Starting MedPath Learning Hub Backend API Integration Tests...\n");
  
  await testGeneralEndpoints();
  await testCourseEndpoints();
  await testSubjectAndResourceEndpoints();
  await testAuthAndAdminEndpoints();

  console.log("\n=============================");
  console.log(`Test Execution Finished.`);
  console.log(`  Passed: ${testsPassed}`);
  console.log(`  Failed: ${testsFailed}`);
  console.log("=============================");
  
  if (testsFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests();
