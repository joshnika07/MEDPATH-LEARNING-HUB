const connectDB = require("../config/db");

/**
 * Fetch all courses from MySQL
 */
async function getAllCourses() {
  const pool = await connectDB.getPool();
  if (!pool) return null;

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
  return rows;
}

/**
 * Fetch one course by ID (including semesters and subjects)
 */
async function getCourseById(courseId) {
  const pool = await connectDB.getPool();
  if (!pool) return null;

  const [courses] = await pool.query("SELECT * FROM courses WHERE course_id = ?", [courseId]);
  if (courses.length === 0) return null;

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

  return {
    id: course.course_id,
    name: course.course_name,
    fullName: course.full_name,
    duration: course.duration,
    totalCourses: course.total_courses,
    description: course.description,
    semesters: formattedSemesters
  };
}

/**
 * Fetch semesters/year data by course ID
 */
async function getSemestersByCourseId(courseId) {
  const pool = await connectDB.getPool();
  if (!pool) return null;

  const [courses] = await pool.query("SELECT course_name FROM courses WHERE course_id = ?", [courseId]);
  if (courses.length === 0) return null;

  const [semesters] = await pool.query(`
    SELECT 
      s.semester_id AS id, 
      s.semester_name AS name, 
      COUNT(sub.subject_id) AS subjectCount
    FROM semesters s 
    LEFT JOIN subjects sub ON s.semester_id = sub.semester_id 
    WHERE s.course_id = ? 
    GROUP BY s.semester_id
  `, [courseId]);

  return {
    courseName: courses[0].course_name,
    semesters
  };
}

/**
 * Fetch subjects for a specific semester
 */
async function getSubjectsBySemester(courseId, semesterId) {
  const pool = await connectDB.getPool();
  if (!pool) return null;

  const [semesterInfo] = await pool.query(`
    SELECT c.course_name, sem.semester_name 
    FROM semesters sem
    JOIN courses c ON sem.course_id = c.course_id
    WHERE sem.semester_id = ? AND sem.course_id = ?
  `, [semesterId, courseId]);

  if (semesterInfo.length === 0) return null;

  const [subjects] = await pool.query(`
    SELECT subject_id AS id, subject_name AS name 
    FROM subjects 
    WHERE semester_id = ?
  `, [semesterId]);

  return {
    courseName: semesterInfo[0].course_name,
    semesterName: semesterInfo[0].semester_name,
    subjects
  };
}

/**
 * Fetch subject details and resources
 */
async function getSubjectDetails(subjectId) {
  const pool = await connectDB.getPool();
  if (!pool) return null;

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
  `, [subjectId]);

  if (subjects.length === 0) return null;

  const subject = subjects[0];
  const [resourcesRows] = await pool.query("SELECT * FROM subject_resources WHERE subject_id = ?", [subject.id]);

  return {
    subject,
    resourcesRow: resourcesRows.length > 0 ? resourcesRows[0] : null
  };
}

/**
 * Fetch search results for subjects
 */
async function searchSubjects(query) {
  const pool = await connectDB.getPool();
  if (!pool) return null;

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

  return subjects;
}

/**
 * Fetch all subjects
 */
async function getAllSubjectsList() {
  const pool = await connectDB.getPool();
  if (!pool) return null;

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
  return subjects;
}

/**
 * Fetch all subjects for a specific course
 */
async function getSubjectsByCourseId(courseId) {
  const pool = await connectDB.getPool();
  if (!pool) return null;

  const [courses] = await pool.query("SELECT course_name FROM courses WHERE course_id = ?", [courseId]);
  if (courses.length === 0) return null;

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
  `, [courseId]);

  return {
    courseName: courses[0].course_name,
    subjects
  };
}

/**
 * Check if a subject exists in the database
 */
async function checkSubjectExists(subjectId) {
  const pool = await connectDB.getPool();
  if (!pool) return false;
  const [rows] = await pool.query("SELECT 1 FROM subjects WHERE subject_id = ?", [subjectId]);
  return rows.length > 0;
}

/**
 * Check if resources already exist for a subject
 */
async function checkSubjectResourcesExist(subjectId) {
  const pool = await connectDB.getPool();
  if (!pool) return false;
  const [rows] = await pool.query("SELECT 1 FROM subject_resources WHERE subject_id = ?", [subjectId]);
  return rows.length > 0;
}

/**
 * Insert new resource details for a subject
 */
async function addSubjectResources(subjectId, resources) {
  const pool = await connectDB.getPool();
  if (!pool) return null;

  const [result] = await pool.query(
    `INSERT INTO subject_resources (subject_id, syllabus_units, study_materials, important_topics, video_links, practicals, learning_process) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      subjectId,
      JSON.stringify(resources.syllabusUnits || []),
      JSON.stringify(resources.studyMaterials || []),
      JSON.stringify(resources.importantTopics || []),
      JSON.stringify(resources.videos || []),
      JSON.stringify(resources.practicals || []),
      JSON.stringify(resources.learningProcess || [])
    ]
  );
  return result.affectedRows > 0;
}

/**
 * Update existing resource details for a subject
 */
async function updateSubjectResources(subjectId, resources) {
  const pool = await connectDB.getPool();
  if (!pool) return null;

  const [result] = await pool.query(
    `UPDATE subject_resources 
     SET syllabus_units = ?, 
         study_materials = ?, 
         important_topics = ?, 
         video_links = ?, 
         practicals = ?, 
         learning_process = ? 
     WHERE subject_id = ?`,
    [
      JSON.stringify(resources.syllabusUnits || []),
      JSON.stringify(resources.studyMaterials || []),
      JSON.stringify(resources.importantTopics || []),
      JSON.stringify(resources.videos || []),
      JSON.stringify(resources.practicals || []),
      JSON.stringify(resources.learningProcess || []),
      subjectId
    ]
  );
  return result.affectedRows > 0;
}

/**
 * Delete resources for a subject
 */
async function deleteSubjectResources(subjectId) {
  const pool = await connectDB.getPool();
  if (!pool) return null;

  const [result] = await pool.query("DELETE FROM subject_resources WHERE subject_id = ?", [subjectId]);
  return result.affectedRows > 0;
}

module.exports = {
  getAllCourses,
  getCourseById,
  getSemestersByCourseId,
  getSubjectsBySemester,
  getSubjectDetails,
  searchSubjects,
  getAllSubjectsList,
  getSubjectsByCourseId,
  checkSubjectExists,
  checkSubjectResourcesExist,
  addSubjectResources,
  updateSubjectResources,
  deleteSubjectResources
};
