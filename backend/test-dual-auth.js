const loginUrl = "http://localhost:5000/api/auth/admin/login";
const adminUrl = "http://localhost:5000/api/admin/subjects/bpharm-sem-1-human-anatomy-and-physiology/resources";

const body = {
  syllabusUnits: ["Unit 1: Test Anatomy"],
  studyMaterials: ["Anatomy Notes"],
  importantTopics: ["Bones"],
  videos: ["Video anatomy"],
  practicals: ["Skeleton check"],
  learningProcess: ["Read", "Study", "Revise"]
};

async function testApiKeyAuth() {
  const response = await fetch(adminUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": "medpath-admin-123"
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  console.log("1. API Key Auth Test:");
  console.log("   Status:", response.status);
  console.log("   Data:", data);
  if (response.status === 200 && data.success === true) {
    console.log("   Pass!");
  } else {
    console.log("   Fail!");
  }
}

async function testJwtAuth() {
  // Login first
  const loginRes = await fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: "admin",
      password: "MedPath@123"
    })
  });

  const loginData = await loginRes.json();
  const token = loginData.token;

  if (!token) {
    console.log("2. JWT Auth Test - Login failed, could not obtain token.");
    console.log("   Fail!");
    return;
  }

  // Request with Bearer Token
  const response = await fetch(adminUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  console.log("2. JWT Auth Test:");
  console.log("   Status:", response.status);
  console.log("   Data:", data);
  if (response.status === 200 && data.success === true) {
    console.log("   Pass!");
  } else {
    console.log("   Fail!");
  }
}

async function testAuthFailure() {
  const response = await fetch(adminUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  console.log("3. Unauthorized Test:");
  console.log("   Status:", response.status);
  console.log("   Data:", data);
  if (response.status === 401 && data.success === false) {
    console.log("   Pass!");
  } else {
    console.log("   Fail!");
  }
}

async function runTests() {
  try {
    await testApiKeyAuth();
    await testJwtAuth();
    await testAuthFailure();
  } catch (error) {
    console.error("Test execution failed:", error.message);
  }
}

runTests();
