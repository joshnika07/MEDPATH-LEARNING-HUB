# Database Design

This document details the database schema, including tables, field types, keys, and examples.

---

## 1. Courses Table

| Field | Type | Description | Key |
| :--- | :--- | :--- | :--- |
| **course_id** | INT | Unique identifier for each course | Primary Key |
| **course_name** | VARCHAR | Name of the course | |
| **duration** | VARCHAR | Duration of the course | |

### Examples:
* `1` | `B.Pharm` | `4 Years`
* `2` | `B.Sc Nursing` | `4 Years`
* `3` | `GNM Nursing` | `3 Years`

---

## 2. Subjects Table

| Field | Type | Description | Key |
| :--- | :--- | :--- | :--- |
| **subject_id** | INT | Unique identifier for each subject | Primary Key |
| **course_id** | INT | ID of the course this subject belongs to | Foreign Key referencing `Courses(course_id)` |
| **semester** | VARCHAR | Semester/year of the subject | |
| **subject_name** | VARCHAR | Name of the subject | |

### Examples:
* `Human Anatomy`
* `Physiology`
* `Pharmacology`

---

## 3. Syllabus Table

| Field | Type | Description | Key |
| :--- | :--- | :--- | :--- |
| **syllabus_id** | INT | Unique identifier for each syllabus entry | Primary Key |
| **subject_id** | INT | ID of the subject this syllabus unit belongs to | Foreign Key referencing `Subjects(subject_id)` |
| **unit_no** | INT | Unit number | |
| **unit_title** | VARCHAR | Title of the unit | |

---

## 4. Materials Table

| Field | Type | Description | Key |
| :--- | :--- | :--- | :--- |
| **material_id** | INT | Unique identifier for each material | Primary Key |
| **subject_id** | INT | ID of the subject this material belongs to | Foreign Key referencing `Subjects(subject_id)` |
| **title** | VARCHAR | Title of the material | |
| **pdf_link** | TEXT | URL link to the PDF material | |

---

## 5. Videos Table

| Field | Type | Description | Key |
| :--- | :--- | :--- | :--- |
| **video_id** | INT | Unique identifier for each video entry | Primary Key |
| **subject_id** | INT | ID of the subject this video belongs to | Foreign Key referencing `Subjects(subject_id)` |
| **youtube_link** | TEXT | URL link to the YouTube video | |

---

## 6. Important Topics Table

| Field | Type | Description | Key |
| :--- | :--- | :--- | :--- |
| **topic_id** | INT | Unique identifier for each topic | Primary Key |
| **subject_id** | INT | ID of the subject this topic belongs to | Foreign Key referencing `Subjects(subject_id)` |
| **topic_name** | VARCHAR | Name/title of the topic | |

---

## 7. Practicals Table

| Field | Type | Description | Key |
| :--- | :--- | :--- | :--- |
| **practical_id** | INT | Unique identifier for each practical | Primary Key |
| **subject_id** | INT | ID of the subject this practical belongs to | Foreign Key referencing `Subjects(subject_id)` |
| **practical_title** | VARCHAR | Title of the practical | |
