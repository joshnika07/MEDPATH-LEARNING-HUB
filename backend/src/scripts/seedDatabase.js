const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

// Load environment variables from the .env file in the backend directory
dotenv.config({ path: path.join(__dirname, "../../.env") });

const connectDB = require("../config/db");
const { getAllCourses } = require("../data/courseData");
const buildSubjectResources = require("../utils/resourceTemplate");

async function checkAndInitDatabase() {
  const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    port: parseInt(process.env.DB_PORT || "3306", 10),
  };

  console.log("Connecting to MySQL to recreate database schema...");
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
  } catch (error) {
    console.error("Failed to connect to MySQL server. Please check if MySQL is running and credentials in .env are correct.");
    console.error("Error details:", error.message);
    process.exit(1);
  }

  const dbName = process.env.DB_NAME || "medpath_learning_hub";
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await connection.query(`USE \`${dbName}\``);

  console.log("Dropping existing tables to prevent schema mismatch conflicts...");
  await connection.query("SET FOREIGN_KEY_CHECKS = 0");
  
  const tablesToDrop = [
    "subject_resources",
    "practicals",
    "important_topics",
    "videos",
    "materials",
    "study_materials",
    "syllabus",
    "subjects",
    "semesters",
    "courses"
  ];
  for (const table of tablesToDrop) {
    await connection.query(`DROP TABLE IF EXISTS \`${table}\``);
  }
  
  await connection.query("SET FOREIGN_KEY_CHECKS = 1");

  const schemaPath = path.join(__dirname, "../../database/schema.sql");
  if (fs.existsSync(schemaPath)) {
    console.log("Running schema.sql to initialize clean tables...");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    const queries = schemaSql
      .split(";")
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.toLowerCase().startsWith("create database") && !q.toLowerCase().startsWith("use"));

    for (const query of queries) {
      try {
        await connection.query(query);
      } catch (err) {
        console.error(`Error running query: ${query.substring(0, 100)}...`);
        console.error("Error details:", err.message);
        process.exit(1);
      }
    }
  } else {
    console.error(`Schema file not found at: ${schemaPath}`);
    process.exit(1);
  }
  
  await connection.end();
  console.log("Database schema initialized successfully.");
}

async function seed() {
  // Ensure DB and tables exist first and match current schema.sql
  await checkAndInitDatabase();

  const pool = await connectDB();
  if (!pool) {
    console.error("Failed to obtain MySQL connection pool.");
    process.exit(1);
  }

  console.log("Seeding database with course data...");

  try {
    // Disable foreign key checks for seeding
    await pool.query("SET FOREIGN_KEY_CHECKS = 0");

    // Clear tables
    await pool.query("TRUNCATE TABLE subject_resources");
    await pool.query("TRUNCATE TABLE subjects");
    await pool.query("TRUNCATE TABLE semesters");
    await pool.query("TRUNCATE TABLE courses");

    // Re-enable foreign key checks
    await pool.query("SET FOREIGN_KEY_CHECKS = 1");

    // Get all courses from mock data
    const courses = getAllCourses();

    // Insert data
    for (const course of courses) {
      console.log(`Inserting course: ${course.name} (${course.id})`);
      await pool.query(
        `INSERT INTO courses (course_id, course_name, full_name, duration, total_courses, description) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          course.id,
          course.name,
          course.fullName || null,
          course.duration || null,
          course.totalCourses || null,
          course.description || null
        ]
      );

      for (const semester of course.semesters) {
        console.log(`  Inserting semester: ${semester.name} (${semester.id})`);
        await pool.query(
          `INSERT INTO semesters (semester_id, course_id, semester_name) 
           VALUES (?, ?, ?)`,
          [
            semester.id,
            course.id,
            semester.name
          ]
        );

        for (const subject of semester.subjects) {
          console.log(`    Inserting subject: ${subject.name} (${subject.id})`);
          await pool.query(
            `INSERT INTO subjects (subject_id, semester_id, subject_name) 
             VALUES (?, ?, ?)`,
            [
              subject.id,
              semester.id,
              subject.name
            ]
          );

          // Get templated resources for this subject
          const resources = buildSubjectResources(subject);

          await pool.query(
            `INSERT INTO subject_resources (subject_id, syllabus_units, study_materials, important_topics, video_links, practicals, learning_process) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              subject.id,
              JSON.stringify(resources.syllabusUnits || []),
              JSON.stringify(resources.studyMaterials || []),
              JSON.stringify(resources.importantTopics || []),
              JSON.stringify(resources.videos || []),
              JSON.stringify(resources.practicals || []),
              JSON.stringify(resources.learningProcess || [])
            ]
          );
        }
      }
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // End the pool connection to let the process terminate cleanly
    await pool.end();
  }
}

seed();
