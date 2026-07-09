const loginUrl = "http://localhost:5000/api/auth/admin/login";
const reqLogsUrl = "http://localhost:5000/api/admin/logs/requests";
const actLogsUrl = "http://localhost:5000/api/admin/logs/activities";

async function testUnauthorized() {
  console.log("1. Testing unauthorized log retrieval...");
  
  const res1 = await fetch(reqLogsUrl);
  console.log("   GET /logs/requests status:", res1.status);
  
  const res2 = await fetch(actLogsUrl);
  console.log("   GET /logs/activities status:", res2.status);

  if (res1.status === 401 && res2.status === 401) {
    console.log("   Pass!");
  } else {
    console.log("   Fail!");
  }
}

async function testWithToken() {
  console.log("2. Testing log retrieval with JWT token...");
  
  // Login first
  const loginRes = await fetch(loginUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "MedPath@123" })
  });

  const loginData = await loginRes.json();
  const token = loginData.token;

  if (!token) {
    console.log("   Login failed, could not obtain token.");
    console.log("   Fail!");
    return;
  }

  // Request requests log
  const res1 = await fetch(reqLogsUrl, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const data1 = await res1.json();
  console.log("   GET /logs/requests status:", res1.status);
  console.log("   GET /logs/requests count:", data1.count);

  // Request activities log
  const res2 = await fetch(actLogsUrl, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const data2 = await res2.json();
  console.log("   GET /logs/activities status:", res2.status);
  console.log("   GET /logs/activities count:", data2.count);

  if (res1.status === 200 && res2.status === 200 && Array.isArray(data1.logs) && Array.isArray(data2.logs)) {
    console.log("   Pass!");
  } else {
    console.log("   Fail!");
  }
}

async function testWithApiKey() {
  console.log("3. Testing log retrieval with x-admin-key fallback...");

  const res1 = await fetch(reqLogsUrl, {
    headers: { "x-admin-key": "medpath-admin-123" }
  });
  const data1 = await res1.json();
  console.log("   GET /logs/requests status:", res1.status);
  console.log("   GET /logs/requests count:", data1.count);

  const res2 = await fetch(actLogsUrl, {
    headers: { "x-admin-key": "medpath-admin-123" }
  });
  const data2 = await res2.json();
  console.log("   GET /logs/activities status:", res2.status);
  console.log("   GET /logs/activities count:", data2.count);

  if (res1.status === 200 && res2.status === 200 && Array.isArray(data1.logs) && Array.isArray(data2.logs)) {
    console.log("   Pass!");
  } else {
    console.log("   Fail!");
  }
}

async function runTests() {
  try {
    // Generate some standard requests first so request_activity.log has entries
    await fetch("http://localhost:5000/api/health");
    await fetch("http://localhost:5000/api/courses");
    
    // Give some time for logs writing
    await new Promise(resolve => setTimeout(resolve, 500));

    await testUnauthorized();
    await testWithToken();
    await testWithApiKey();
  } catch (error) {
    console.error("Test execution failed:", error.message);
  }
}

runTests();
