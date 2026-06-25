# API Route Specification (GET Routes)

This document outlines the design and behavior of the backend API endpoints. All routes return content in JSON format.

---

## Endpoint Index

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/courses` | Retrieve a list of all courses |
| **GET** | `/api/course/:id` | Retrieve detailed information for a specific course |
| **GET** | `/api/subjects/:courseId` | Retrieve all subjects for a specific course (e.g. grouped by semester) |
| **GET** | `/api/syllabus/:subjectId` | Retrieve the syllabus units for a specific subject |
| **GET** | `/api/materials/:subjectId` | Retrieve all learning materials (e.g. PDFs) for a subject |
| **GET** | `/api/videos/:subjectId` | Retrieve learning videos (e.g. YouTube links) for a subject |
| **GET** | `/api/topics/:subjectId` | Retrieve list of important topics for a subject |
| **GET** | `/api/practicals/:subjectId` | Retrieve details of practical lessons for a subject |

---

## Route Details

### 1. Get All Courses
* **Endpoint**: `/api/courses`
* **Response Status**: `200 OK`
* **Response Payload Example**:
  ```json
  [
    {
      "course_id": 1,
      "course_name": "B.Pharm",
      "duration": "4 Years"
    },
    {
      "course_id": 2,
      "course_name": "B.Sc Nursing",
      "duration": "4 Years"
    }
  ]
  ```

### 2. Get Specific Course
* **Endpoint**: `/api/course/:id`
* **Parameters**:
  * `id` (integer) - The unique course identifier
* **Response Status**: `200 OK` / `404 Not Found`
* **Response Payload Example**:
  ```json
  {
    "course_id": 1,
    "course_name": "B.Pharm",
    "duration": "4 Years"
  }
  ```

### 3. Get Subjects by Course
* **Endpoint**: `/api/subjects/:courseId`
* **Parameters**:
  * `courseId` (integer) - ID of the course
* **Response Status**: `200 OK`
* **Response Payload Example**:
  ```json
  [
    {
      "subject_id": 101,
      "course_id": 1,
      "semester": "Semester 1",
      "subject_name": "Human Anatomy"
    },
    {
      "subject_id": 102,
      "course_id": 1,
      "semester": "Semester 1",
      "subject_name": "Physiology"
    }
  ]
  ```

### 4. Get Syllabus by Subject
* **Endpoint**: `/api/syllabus/:subjectId`
* **Parameters**:
  * `subjectId` (integer) - ID of the subject
* **Response Status**: `200 OK`
* **Response Payload Example**:
  ```json
  [
    {
      "syllabus_id": 201,
      "subject_id": 101,
      "unit_no": 1,
      "unit_title": "Introduction to Human Body & Tissues"
    }
  ]
  ```

### 5. Get Materials by Subject
* **Endpoint**: `/api/materials/:subjectId`
* **Parameters**:
  * `subjectId` (integer) - ID of the subject
* **Response Status**: `200 OK`
* **Response Payload Example**:
  ```json
  [
    {
      "material_id": 301,
      "subject_id": 101,
      "title": "Anatomy Basics Handout",
      "pdf_link": "/uploads/anatomy_basics.pdf"
    }
  ]
  ```

### 6. Get Videos by Subject
* **Endpoint**: `/api/videos/:subjectId`
* **Parameters**:
  * `subjectId` (integer) - ID of the subject
* **Response Status**: `200 OK`
* **Response Payload Example**:
  ```json
  [
    {
      "video_id": 401,
      "subject_id": 101,
      "youtube_link": "https://www.youtube.com/watch?v=example"
    }
  ]
  ```

### 7. Get Important Topics by Subject
* **Endpoint**: `/api/topics/:subjectId`
* **Parameters**:
  * `subjectId` (integer) - ID of the subject
* **Response Status**: `200 OK`
* **Response Payload Example**:
  ```json
  [
    {
      "topic_id": 501,
      "subject_id": 101,
      "topic_name": "Cell Structure and Division"
    }
  ]
  ```

### 8. Get Practicals by Subject
* **Endpoint**: `/api/practicals/:subjectId`
* **Parameters**:
  * `subjectId` (integer) - ID of the subject
* **Response Status**: `200 OK`
* **Response Payload Example**:
  ```json
  [
    {
      "practical_id": 601,
      "subject_id": 101,
      "practical_title": "Microscope handling and observation of epithelial tissues"
    }
  ]
  ```
