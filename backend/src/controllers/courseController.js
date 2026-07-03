const {
  getAllCourses,
  getCourseById,
  getAllSubjects,
  getSubjectById
} = require("../data/courseData");

const buildSubjectResources = require("../utils/resourceTemplate");
const connectDB = require("../config/db");

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
    const pool = await connectDB.getPool();
    if (pool) {
      const [rows] = await pool.query(`
        SELECT 
          c.course_id AS id, 
          c.course_name AS name, 
          c.full_name AS fullName, 
          c.duration, 
          c.total_courses AS totalCourses, 
          c.description, 
          COALESCE(s.sem_count, 0) AS semesterCount
        FROM courses c
        LEFT JOIN (
          SELECT course_id, COUNT(*) AS sem_count 
          FROM semesters 
          GROUP BY course_id
        ) s ON c.course_id = s.course_id
      `);
      if (rows && rows.length > 0) {
        return res.json({
          success: true,
          count: rows.length,
          data: rows
        });
      }
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
    const pool = await connectDB.getPool();
    if (pool) {
      const [courses] = await pool.query("SELECT * FROM courses WHERE course_id = ?", [req.params.courseId]);
      if (courses.length > 0) {
        const course = courses[0];
        const [semesters] = await pool.query("SELECT * FROM semesters WHERE course_id = ?", [course.course_id]);
        const [subjects] = await pool.query(`
          SELECT s.* FROM subjects s 
          JOIN semesters sem ON s.semester_id = sem.semester_id 
          WHERE sem.course_id = ?
        `, [course.course_id]);

        const formattedSemesters = semesters.map(sem => {
          const semSubjects = subjects
            .filter(sub => sub.semester_id === sem.semester_id)
            .map(sub => ({
              id: sub.subject_id,
              name: sub.subject_name
            }));
          return {
            id: sem.semester_id,
            name: sem.semester_name,
            subjects: semSubjects
          };
        });

        return res.json({
          success: true,
          data: {
            id: course.course_id,
            name: course.course_name,
            fullName: course.full_name,
            duration: course.duration,
            totalCourses: course.total_courses,
            description: course.description,
            semesters: formattedSemesters
          }
        });
      }
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
    const pool = await connectDB.getPool();
    if (pool) {
      const [courses] = await pool.query("SELECT course_name FROM courses WHERE course_id = ?", [req.params.courseId]);
      if (courses.length > 0) {
        const [semesters] = await pool.query(`
          SELECT 
            s.semester_id AS id, 
            s.semester_name AS name, 
            COUNT(sub.subject_id) AS subjectCount
          FROM semesters s 
          LEFT JOIN subjects sub ON s.semester_id = sub.semester_id 
          WHERE s.course_id = ? 
          GROUP BY s.semester_id
        `, [req.params.courseId]);
        
        return res.json({
          success: true,
          courseName: courses[0].course_name,
          data: semesters
        });
      }
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
    const pool = await connectDB.getPool();
    if (pool) {
      const [semesterInfo] = await pool.query(`
        SELECT c.course_name, sem.semester_name 
        FROM semesters sem
        JOIN courses c ON sem.course_id = c.course_id
        WHERE sem.semester_id = ? AND sem.course_id = ?
      `, [req.params.semesterId, req.params.courseId]);

      if (semesterInfo.length > 0) {
        const [subjects] = await pool.query(`
          SELECT subject_id AS id, subject_name AS name 
          FROM subjects 
          WHERE semester_id = ?
        `, [req.params.semesterId]);

        return res.json({
          success: true,
          courseName: semesterInfo[0].course_name,
          semesterName: semesterInfo[0].semester_name,
          count: subjects.length,
          data: subjects
        });
      }
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
    const pool = await connectDB.getPool();
    if (pool) {
      const [subjects] = await pool.query(`
        SELECT 
          sub.subject_id AS id, 
          sub.subject_name AS name, 
          c.course_id AS courseId, 
          c.course_name AS courseName, 
          sem.semester_id AS semesterId, 
          sem.semester_name AS semesterName 
        FROM subjects sub 
        JOIN semesters sem ON sub.semester_id = sem.semester_id 
        JOIN courses c ON sem.course_id = c.course_id
        WHERE sub.subject_id = ?
      `, [req.params.subjectId]);

      if (subjects.length > 0) {
        const subject = subjects[0];
        const [resourcesRows] = await pool.query("SELECT * FROM subject_resources WHERE subject_id = ?", [subject.id]);
        
        let resources;
        if (resourcesRows.length > 0) {
          const row = resourcesRows[0];
          resources = {
            syllabusUnits: parseJsonField(row.syllabus_units, []),
            studyMaterials: parseJsonField(row.study_materials, []),
            importantTopics: parseJsonField(row.important_topics, []),
            videos: parseJsonField(row.video_links, []),
            practicals: parseJsonField(row.practicals, []),
            learningProcess: parseJsonField(row.learning_process, [])
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
  const query = (req.query.query || "").toLowerCase();

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Please provide query. Example: /api/search?query=anatomy"
    });
  }

  try {
    const pool = await connectDB.getPool();
    if (pool) {
      const dbQuery = `%${query}%`;
      const [subjects] = await pool.query(`
        SELECT 
          sub.subject_id AS id, 
          sub.subject_name AS name, 
          c.course_id AS courseId, 
          c.course_name AS courseName, 
          sem.semester_id AS semesterId, 
          sem.semester_name AS semesterName 
        FROM subjects sub 
        JOIN semesters sem ON sub.semester_id = sem.semester_id 
        JOIN courses c ON sem.course_id = c.course_id
        WHERE sub.subject_name LIKE ? OR c.course_name LIKE ? OR sem.semester_name LIKE ?
      `, [dbQuery, dbQuery, dbQuery]);

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
    const pool = await connectDB.getPool();
    if (pool) {
      const [subjects] = await pool.query(`
        SELECT 
          sub.subject_id AS id, 
          sub.subject_name AS name, 
          c.course_id AS courseId, 
          c.course_name AS courseName, 
          sem.semester_id AS semesterId, 
          sem.semester_name AS semesterName 
        FROM subjects sub 
        JOIN semesters sem ON sub.semester_id = sem.semester_id 
        JOIN courses c ON sem.course_id = c.course_id
      `);

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
    const pool = await connectDB.getPool();
    if (pool) {
      const [courses] = await pool.query("SELECT course_name FROM courses WHERE course_id = ?", [req.params.courseId]);
      if (courses.length > 0) {
        const [subjects] = await pool.query(`
          SELECT 
            sub.subject_id AS id, 
            sub.subject_name AS name, 
            c.course_id AS courseId, 
            c.course_name AS courseName, 
            sem.semester_id AS semesterId, 
            sem.semester_name AS semesterName 
          FROM subjects sub 
          JOIN semesters sem ON sub.semester_id = sem.semester_id 
          JOIN courses c ON sem.course_id = c.course_id 
          WHERE c.course_id = ?
        `, [req.params.courseId]);

        return res.json({
          success: true,
          courseName: courses[0].course_name,
          count: subjects.length,
          data: subjects
        });
      }
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
