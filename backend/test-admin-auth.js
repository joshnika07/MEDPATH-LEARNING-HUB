const url =
  "http://localhost:5000/api/admin/subjects/bpharm-sem-1-human-anatomy-and-physiology/resources";

const body = {
  syllabusUnits: ["Unit 1: Updated Introduction to Anatomy"],
  studyMaterials: ["Updated Anatomy notes PDF"],
  importantTopics: ["Updated Cell structure"],
  videos: ["Updated Introduction video"],
  practicals: ["Updated Identification of bones"],
  learningProcess: ["Read syllabus", "Study updated notes", "Revise"]
};

async function testWithoutAdminKey() {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  console.log("Without Admin Key:");
  console.log(data);
}

async function testWithAdminKey() {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": "medpath-admin-123"
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  console.log("With Admin Key:");
  console.log(data);
}

async function runTests() {
  try {
    await testWithoutAdminKey();
    await testWithAdminKey();
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

runTests();
