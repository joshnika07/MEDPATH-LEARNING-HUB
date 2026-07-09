const url = "http://localhost:5000/api/project/summary";

async function testProjectSummary() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok && data.success === true) {
      console.log("PASS: GET /api/project/summary");
    } else {
      console.log("FAIL: GET /api/project/summary");
      console.log(data);
    }

    console.log("Project summary API test completed.");
  } catch (error) {
    console.log("FAIL: GET /api/project/summary");
    console.error(error.message);
  }
}

testProjectSummary();
