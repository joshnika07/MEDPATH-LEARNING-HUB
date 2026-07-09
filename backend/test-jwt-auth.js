const loginUrl = "http://localhost:5000/api/auth/admin/login";
const adminUrl = "http://localhost:5000/api/admin/subjects/bpharm-sem-1-human-anatomy-and-physiology/resources";

const body = {
  syllabusUnits: [
    "Unit 1: Updated Introduction to Anatomy",
    "Unit 2: Updated Cell and Tissue Structure"
  ],
  studyMaterials: [
    "Updated Anatomy notes PDF"
  ],
  importantTopics: [
    "Updated Cell structure",
    "Updated Skeletal system"
  ],
  videos: [
    "Updated Introduction video"
  ],
  practicals: [
    "Updated Identification of bones"
  ],
  learningProcess: [
    "Read syllabus",
    "Study updated notes",
    "Watch videos",
    "Revise important topics"
  ]
};

async function testWithoutToken() {
  const response = await fetch(adminUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  console.log("1. Request without token:");
  console.log("   Status:", response.status);
  console.log("   Data:", data);
  if (response.status === 401 && data.success === false && data.message === "Authorization token is required") {
    console.log("   Pass!");
  } else {
    console.log("   Fail!");
  }
}

async function testWithInvalidToken() {
  const response = await fetch(adminUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer invalid_token_here"
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  console.log("2. Request with invalid token:");
  console.log("   Status:", response.status);
  console.log("   Data:", data);
  if (response.status === 403 && data.success === false && data.message === "Invalid or expired authorization token") {
    console.log("   Pass!");
  } else {
    console.log("   Fail!");
  }
}

async function testWithValidToken() {
  // First, login to get a valid token
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
    console.log("3. Login failed, could not obtain token.");
    console.log("   Fail!");
    return;
  }

  // Now, make the authorized request
  const response = await fetch(adminUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  console.log("3. Request with valid token:");
  console.log("   Status:", response.status);
  console.log("   Data:", data);
  if (response.status === 200 && data.success === true) {
    console.log("   Pass!");
  } else {
    console.log("   Fail!");
  }
}

async function runTests() {
  try {
    await testWithoutToken();
    await testWithInvalidToken();
    await testWithValidToken();
  } catch (error) {
    console.error("Test execution failed:", error.message);
  }
}

runTests();
