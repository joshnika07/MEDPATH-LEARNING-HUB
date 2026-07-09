const BASE_URL = "http://localhost:5000";

const headers = {
  "x-admin-key": "medpath-admin-123"
};

async function testLogs() {
  try {
    const requestLogsResponse = await fetch(`${BASE_URL}/api/admin/logs/requests`, {
      method: "GET",
      headers
    });

    const requestLogs = await requestLogsResponse.json();

    console.log("Request Logs API:");
    console.log(requestLogs);

    const activityLogsResponse = await fetch(`${BASE_URL}/api/admin/logs/activities`, {
      method: "GET",
      headers
    });

    const activityLogs = await activityLogsResponse.json();

    console.log("Admin Activity Logs API:");
    console.log(activityLogs);
  } catch (error) {
    console.error("Logs API Test Failed:", error.message);
  }
}

testLogs();
