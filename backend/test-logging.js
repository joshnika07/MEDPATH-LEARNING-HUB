const fs = require("fs");
const path = require("path");

const healthUrl = "http://localhost:5000/api/health";
const coursesUrl = "http://localhost:5000/api/courses";
const loginUrl = "http://localhost:5000/api/auth/admin/login";
const adminUrl = "http://localhost:5000/api/admin/subjects/bpharm-sem-1-human-anatomy-and-physiology/resources";

const body = {
  syllabusUnits: ["Unit 1: Logger Check"],
  studyMaterials: ["Logger PDF"],
  importantTopics: ["Logger Topic"],
  videos: ["Logger Video"],
  practicals: ["Logger Practical"],
  learningProcess: ["Logger Step"]
};

async function runLoggerTests() {
  try {
    console.log("--- Starting Logger Test Suite ---");

    // 1. GET /api/health
    console.log("Testing GET /api/health...");
    const resHealth = await fetch(healthUrl);
    console.log("GET /api/health Status:", resHealth.status);

    // 2. GET /api/courses
    console.log("Testing GET /api/courses...");
    const resCourses = await fetch(coursesUrl);
    console.log("GET /api/courses Status:", resCourses.status);

    // 3. POST /api/auth/admin/login
    console.log("Testing POST /api/auth/admin/login...");
    const resLogin = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "MedPath@123" })
    });
    const loginData = await resLogin.json();
    console.log("POST /api/auth/admin/login Status:", resLogin.status);
    const token = loginData.token;

    if (!token) {
      throw new Error("Could not obtain admin login JWT token");
    }

    // 4. PUT /api/admin/subjects/:subjectId/resources
    console.log("Testing PUT /api/admin/subjects/:subjectId/resources...");
    const resPut = await fetch(adminUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    console.log("PUT Resources Status:", resPut.status);

    // 5. DELETE /api/admin/subjects/:subjectId/resources
    console.log("Testing DELETE /api/admin/subjects/:subjectId/resources...");
    const resDelete = await fetch(adminUrl, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    console.log("DELETE Resources Status:", resDelete.status);

    // Add brief pause to allow asynchronous file writing to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify logs
    console.log("\n--- Checking Logs ---");
    const logFilePath = path.join(__dirname, "logs", "admin_actions.log");
    if (fs.existsSync(logFilePath)) {
      console.log("Log file found at backend/logs/admin_actions.log!");
      console.log("Log Contents:\n");
      const contents = fs.readFileSync(logFilePath, "utf8");
      console.log(contents);
    } else {
      console.log("ERROR: Log file not found!");
    }

  } catch (error) {
    console.error("Test execution failed:", error.message);
  }
}

runLoggerTests();
