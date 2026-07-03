function buildSubjectResources(subject) {
  return {
    syllabusUnits: [
      `Unit 1: Introduction to ${subject.name}`,
      `Unit 2: Basic concepts and definitions`,
      `Unit 3: Main topics and applications`,
      `Unit 4: Practical or clinical importance`,
      `Unit 5: Exam revision and important questions`
    ],

    studyMaterials: [
      "Class notes",
      "PDF materials",
      "PPT presentations",
      "Previous year question papers",
      "Reference books"
    ],

    importantTopics: [
      `Important definitions in ${subject.name}`,
      "Short answer questions",
      "Long answer questions",
      "Important diagrams",
      "Frequently repeated examination topics"
    ],

    videos: [
      `Introduction video for ${subject.name}`,
      "Unit-wise explanation videos",
      "Important topic revision videos",
      "Practical demonstration videos"
    ],

    practicals: [
      `Practical manual for ${subject.name}`,
      "Lab record preparation",
      "Experiment or procedure explanation",
      "Observation and result format",
      "Viva questions"
    ],

    learningProcess: [
      "Read the syllabus first.",
      "Study the notes.",
      "Watch videos for difficult topics.",
      "Prepare important exam topics.",
      "Complete practical records.",
      "Revise previous question papers."
    ]
  };
}

module.exports = buildSubjectResources;
