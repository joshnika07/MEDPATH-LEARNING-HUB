const url = "http://localhost:5000/api/admin/subjects/bpharm-sem-1-human-anatomy-and-physiology/resources";

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

async function testUpdateAPI() {
  try {
    const response = await fetch(url, {
      method: "PUT",
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

testUpdateAPI();
