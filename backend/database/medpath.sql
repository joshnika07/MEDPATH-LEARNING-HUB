CREATE DATABASE IF NOT EXISTS medpath_learning_hub;
USE medpath_learning_hub;

-- 1. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL UNIQUE,
    duration VARCHAR(50) NOT NULL
);

-- 2. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    semester VARCHAR(50) NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- 3. Syllabus Table
CREATE TABLE IF NOT EXISTS syllabus (
    syllabus_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    unit_no INT NOT NULL,
    unit_title VARCHAR(255) NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- 4. Materials Table
CREATE TABLE IF NOT EXISTS materials (
    material_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    pdf_link TEXT NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- 5. Videos Table
CREATE TABLE IF NOT EXISTS videos (
    video_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    youtube_link TEXT NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- 6. Important Topics Table
CREATE TABLE IF NOT EXISTS important_topics (
    topic_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    topic_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- 7. Practicals Table
CREATE TABLE IF NOT EXISTS practicals (
    practical_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    practical_title VARCHAR(255) NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- Seed Data for Courses
INSERT INTO courses (course_id, course_name, duration) VALUES
(1, 'B.Pharm', '4 Years'),
(2, 'B.Sc Nursing', '4 Years'),
(3, 'GNM Nursing', '3 Years')
ON DUPLICATE KEY UPDATE course_name=VALUES(course_name), duration=VALUES(duration);

-- Seed Data for Subjects (First Semester B.Pharm & B.Sc Nursing)
INSERT INTO subjects (subject_id, course_id, semester, subject_name) VALUES
(101, 1, 'Semester 1', 'Human Anatomy'),
(102, 1, 'Semester 1', 'Physiology'),
(103, 1, 'Semester 1', 'Pharmacology'),
(104, 2, 'Semester 1', 'Anatomy and Physiology'),
(105, 2, 'Semester 1', 'Nutrition and Biochemistry')
ON DUPLICATE KEY UPDATE course_id=VALUES(course_id), semester=VALUES(semester), subject_name=VALUES(subject_name);

-- Seed Data for Syllabus
INSERT INTO syllabus (syllabus_id, subject_id, unit_no, unit_title) VALUES
(201, 101, 1, 'Introduction to Human Body & Tissues'),
(202, 101, 2, 'Skeletal and Muscular Systems'),
(203, 102, 1, 'Cellular Physiology and Transport'),
(204, 104, 1, 'Introduction to Anatomical Terms')
ON DUPLICATE KEY UPDATE subject_id=VALUES(subject_id), unit_no=VALUES(unit_no), unit_title=VALUES(unit_title);

-- Seed Data for Materials
INSERT INTO materials (material_id, subject_id, title, pdf_link) VALUES
(301, 101, 'Anatomy Basics Handout', '/uploads/anatomy_basics.pdf'),
(302, 101, 'Tissues Lecture Slides', '/uploads/tissues_slides.pdf'),
(303, 102, 'Cell Physiology Notes', '/uploads/cell_phys.pdf')
ON DUPLICATE KEY UPDATE subject_id=VALUES(subject_id), title=VALUES(title), pdf_link=VALUES(pdf_link);

-- Seed Data for Videos
INSERT INTO videos (video_id, subject_id, youtube_link) VALUES
(401, 101, 'https://www.youtube.com/watch?v=example1'),
(402, 102, 'https://www.youtube.com/watch?v=example2')
ON DUPLICATE KEY UPDATE subject_id=VALUES(subject_id), youtube_link=VALUES(youtube_link);

-- Seed Data for Important Topics
INSERT INTO important_topics (topic_id, subject_id, topic_name) VALUES
(501, 101, 'Cell Structure and Division'),
(502, 101, 'Types of Epithelial Tissues'),
(503, 102, 'Action Potential Generation')
ON DUPLICATE KEY UPDATE subject_id=VALUES(subject_id), topic_name=VALUES(topic_name);

-- Seed Data for Practicals
INSERT INTO practicals (practical_id, subject_id, practical_title) VALUES
(601, 101, 'Microscope handling and observation of epithelial tissues'),
(602, 101, 'Identification of bones in the human skeleton'),
(603, 102, 'Recording of blood pressure and pulse rate')
ON DUPLICATE KEY UPDATE subject_id=VALUES(subject_id), practical_title=VALUES(practical_title);
