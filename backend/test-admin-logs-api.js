const loginUrl = "http://localhost:5000/api/auth/admin/login";
const logsUrl = "http://localhost:5000/api/admin/logs";

async function testLogsWithoutToken() {
  const response = await fetch(logsUrl, {
    method: "GET"
  });

  const data = await response.json();
  console.log("1. Get logs without token:");
  console.log("   Status:", response.status);
  console.log("   Data:", data);
  if (response.status === 401 && data.success === false) {
    console.log("   Pass!");
  } else {
    console.log("   Fail!");
  }
}

async function testLogsWithToken() {
  // Login first
  const loginRes = await fetch(loginUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "MedPath@123" })
  });

  const loginData = await loginRes.json();
  const token = loginData.token;

  if (!token) {
    console.log("2. Get logs with token - Login failed, could not obtain token.");
    console.log("   Fail!");
    return;
  }

  // Request logs with JWT token
  const response = await fetch(logsUrl, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await response.json();
  console.log("2. Get logs with JWT Bearer Token:");
  console.log("   Status:", response.status);
  console.log("   Data count:", data.count);
  console.log("   Logs count matches:", Array.isArray(data.logs) && data.logs.length === data.count);
  if (response.status === 200 && data.success === true && Array.isArray(data.logs)) {
    console.log("   Pass!");
  } else {
    console.log("   Fail!");
  }
}

async function testLogsWithApiKey() {
  // Request logs with x-admin-key fallback
  const response = await fetch(logsUrl, {
    method: "GET",
    headers: {
      "x-admin-key": "medpath-admin-123"
    }
  });

  const data = await response.json();
  console.log("3. Get logs with x-admin-key fallback:");
  console.log("   Status:", response.status);
  console.log("   Data count:", data.count);
  if (response.status === 200 && data.success === true && Array.isArray(data.logs)) {
    console.log("   Pass!");
  } else {
    console.log("   Fail!");
  }
}

async function runTests() {
  try {
    await testLogsWithoutToken();
    await testLogsWithToken();
    await testLogsWithApiKey();
  } catch (error) {
    console.error("Test execution failed:", error.message);
  }
}

runTests();
