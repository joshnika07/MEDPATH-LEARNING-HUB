const courseModel = require("../models/courseModel");
const {
  getAllCourses,
  getCourseById,
  getAllSubjects,
  getSubjectById
} = require("../data/courseData");
const buildSubjectResources = require("../utils/resourceTemplate");

function parseJsonField(field, fallback) {
  if (!field) return fallback;
  try {
    return JSON.parse(field);
  } catch (e) {
    if (typeof field === "string") {
      return field.split("\n").map(s => s.trim()).filter(Boolean);
    }
    return fallback;
  }
}

async function getCourses(req, res) {
  try {
    const courses = await courseModel.getAllCourses();
    if (courses && courses.length > 0) {
      return res.json({
        success: true,
        count: courses.length,
        data: courses
      });
    }
  } catch (error) {
    console.error("Database query failed for getCourses, using mock data:", error.message);
  }

  try {
    const courses = getAllCourses().map(course => ({
      id: course.id,
      name: course.name,
      fullName: course.fullName,
      duration: course.duration,
      totalCourses: course.totalCourses,
      description: course.description,
      semesterCount: course.semesters.length
    }));

    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getCourse(req, res) {
  try {
    const course = await courseModel.getCourseById(req.params.courseId);
    if (course) {
      return res.json({
        success: true,
        data: course
      });
    }
  } catch (error) {
    console.error("Database query failed for getCourse, using mock data:", error.message);
  }

  try {
    const course = getCourseById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getSemesters(req, res) {
  try {
    const result = await courseModel.getSemestersByCourseId(req.params.courseId);
    if (result) {
      return res.json({
        success: true,
        courseName: result.courseName,
        data: result.semesters
      });
    }
  } catch (error) {
    console.error("Database query failed for getSemesters, using mock data:", error.message);
  }

  try {
    const course = getCourseById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.json({
      success: true,
      courseName: course.name,
      data: course.semesters.map(semester => ({
        id: semester.id,
        name: semester.name,
        subjectCount: semester.subjects.length
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getSubjectsBySemester(req, res) {
  try {
    const result = await courseModel.getSubjectsBySemester(req.params.courseId, req.params.semesterId);
    if (result) {
      return res.json({
        success: true,
        courseName: result.courseName,
        semesterName: result.semesterName,
        count: result.subjects.length,
        data: result.subjects
      });
    }
  } catch (error) {
    console.error("Database query failed for getSubjectsBySemester, using mock data:", error.message);
  }

  try {
    const course = getCourseById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const semester = course.semesters.find(
      sem => sem.id === req.params.semesterId
    );

    if (!semester) {
      return res.status(404).json({
        success: false,
        message: "Semester or year not found"
      });
    }

    res.json({
      success: true,
      courseName: course.name,
      semesterName: semester.name,
      count: semester.subjects.length,
      data: semester.subjects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getSubjectDetails(req, res) {
  try {
    const result = await courseModel.getSubjectDetails(req.params.subjectId);
    if (result) {
      const { subject, resourcesRow } = result;
      let resources;
      if (resourcesRow) {
        resources = {
          syllabusUnits: parseJsonField(resourcesRow.syllabus_units, []),
          studyMaterials: parseJsonField(resourcesRow.study_materials, []),
          importantTopics: parseJsonField(resourcesRow.important_topics, []),
          videos: parseJsonField(resourcesRow.video_links, []),
          practicals: parseJsonField(resourcesRow.practicals, []),
          learningProcess: parseJsonField(resourcesRow.learning_process, [])
        };
      } else {
        resources = buildSubjectResources(subject);
      }

      return res.json({
        success: true,
        data: {
          subject,
          resources
        }
      });
    }
  } catch (error) {
    console.error("Database query failed for getSubjectDetails, using mock data:", error.message);
  }

  try {
    const subject = getSubjectById(req.params.subjectId);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    res.json({
      success: true,
      data: {
        subject,
        resources: buildSubjectResources(subject)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function searchSubjects(req, res) {
  const query = (req.query.query || "").trim().toLowerCase();

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Search query is required. Example: /api/search?query=anatomy"
    });
  }

  try {
    const subjects = await courseModel.searchSubjects(query);
    if (subjects) {
      return res.json({
        success: true,
        query,
        count: subjects.length,
        data: subjects
      });
    }
  } catch (error) {
    console.error("Database query failed for searchSubjects, using mock data:", error.message);
  }

  try {
    const results = getAllSubjects().filter(subject =>
      subject.name.toLowerCase().includes(query) ||
      subject.courseName.toLowerCase().includes(query) ||
      subject.semesterName.toLowerCase().includes(query)
    );

    res.json({
      success: true,
      query,
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getAllSubjectsList(req, res) {
  try {
    const subjects = await courseModel.getAllSubjectsList();
    if (subjects) {
      return res.json({
        success: true,
        count: subjects.length,
        data: subjects
      });
    }
  } catch (error) {
    console.error("Database query failed for getAllSubjectsList, using mock data:", error.message);
  }

  try {
    const subjects = getAllSubjects();

    res.json({
      success: true,
      count: subjects.length,
      data: subjects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getSubjectsByCourse(req, res) {
  try {
    const result = await courseModel.getSubjectsByCourseId(req.params.courseId);
    if (result) {
      return res.json({
        success: true,
        courseName: result.courseName,
        count: result.subjects.length,
        data: result.subjects
      });
    }
  } catch (error) {
    console.error("Database query failed for getSubjectsByCourse, using mock data:", error.message);
  }

  try {
    const course = getCourseById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const subjects = [];

    course.semesters.forEach(semester => {
      semester.subjects.forEach(subject => {
        subjects.push({
          ...subject,
          courseId: course.id,
          courseName: course.name,
          semesterId: semester.id,
          semesterName: semester.name
        });
      });
    });

    res.json({
      success: true,
      courseName: course.name,
      count: subjects.length,
      data: subjects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  getCourses,
  getCourse,
  getSemesters,
  getSubjectsBySemester,
  getSubjectDetails,
  searchSubjects,
  getAllSubjectsList,
  getSubjectsByCourse
};
