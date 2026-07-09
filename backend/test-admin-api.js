const url = "http://localhost:5000/api/admin/subjects/bpharm-sem-1-human-anatomy-and-physiology/resources";

const body = {
  syllabusUnits: ["Unit 1: Introduction to Anatomy"],
  studyMaterials: ["Anatomy notes PDF"],
  importantTopics: ["Cell structure"],
  videos: ["Introduction video"],
  practicals: ["Identification of bones"],
  learningProcess: ["Read syllabus", "Study notes", "Revise"]
};

async function testAPI() {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("API Test Failed:", error.message);
  }
}

testAPI();
