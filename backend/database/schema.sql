CREATE DATABASE IF NOT EXISTS medpath_learning_hub;

USE medpath_learning_hub;

CREATE TABLE courses (
    course_id VARCHAR(50) PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(150),
    duration VARCHAR(50),
    total_courses VARCHAR(50),
    description TEXT
);

CREATE TABLE semesters (
    semester_id VARCHAR(80) PRIMARY KEY,
    course_id VARCHAR(50) NOT NULL,
    semester_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE subjects (
    subject_id VARCHAR(120) PRIMARY KEY,
    semester_id VARCHAR(80) NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (semester_id) REFERENCES semesters(semester_id)
);

CREATE TABLE subject_resources (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id VARCHAR(120) NOT NULL,
    syllabus_units TEXT,
    study_materials TEXT,
    important_topics TEXT,
    video_links TEXT,
    practicals TEXT,
    learning_process TEXT,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);
