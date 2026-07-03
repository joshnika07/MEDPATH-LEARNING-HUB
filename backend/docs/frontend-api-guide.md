# Frontend API Integration Guide

This guide is designed to help you connect the MedPath Learning Hub frontend components to the backend APIs. All requests return clean JSON responses.

---

## 1. Base URL
All API requests should be sent to:
`http://localhost:5000`

---

## 2. Course APIs

### Get All Courses
* **Endpoint**: `/api/courses`
* **Method**: `GET`
* **Description**: Returns all courses with duration, description, and number of semesters.
* **Response Format**:
  ```json
  {
    "success": true,
    "count": 3,
    "data": [
      {
        "id": "bpharm",
        "name": "B.Pharm",
        "fullName": "Bachelor of Pharmacy",
        "duration": "8 Semesters",
        "totalCourses": 40,
        "description": "...",
        "semesterCount": 8
      }
    ]
  }
  ```

### Get Single Course Details
* **Endpoint**: `/api/courses/:courseId`
* **Method**: `GET`
* **Description**: Returns detailed info about a single course, including semesters and their nested subjects.
* **Example**: `/api/courses/bpharm`

---

## 3. Subject APIs

### Get All Subjects
* **Endpoint**: `/api/subjects`
* **Method**: `GET`
* **Description**: Returns a flat list of all subjects across all courses.
* **Response Format**:
  ```json
  {
    "success": true,
    "count": 90,
    "data": [
      {
        "id": "bpharm-sem-1-human-anatomy-and-physiology",
        "name": "Human Anatomy and Physiology",
        "courseId": "bpharm",
        "courseName": "B.Pharm",
        "semesterId": "bpharm-sem-1",
        "semesterName": "SEM-1"
      }
    ]
  }
  ```

### Get Subjects by Course
* **Endpoint**: `/api/courses/:courseId/subjects`
* **Method**: `GET`
* **Description**: Returns all subjects belonging to a specific course.
* **Example**: `/api/courses/bsc-nursing/subjects`

### Get Subject Details & Study Materials
* **Endpoint**: `/api/subjects/:subjectId`
* **Method**: `GET`
* **Description**: Returns a subject's core information and its study resources (syllabus units, videos, practicals, exam topics).
* **Example**: `/api/subjects/bpharm-sem-1-human-anatomy-and-physiology`
* **Response Format**:
  ```json
  {
    "success": true,
    "data": {
      "subject": {
        "id": "bpharm-sem-1-human-anatomy-and-physiology",
        "name": "Human Anatomy and Physiology"
      },
      "resources": {
        "syllabusUnits": ["Unit 1: Introduction...", "Unit 2: ..."],
        "studyMaterials": ["Class notes", "PDF materials"],
        "importantTopics": ["Important definitions..."],
        "videos": ["Introduction video..."],
        "practicals": ["Practical manual..."],
        "learningProcess": ["Read the syllabus first...", "Study notes..."]
      }
    }
  }
  ```

---

## 4. Search API

### Search Across Subjects
* **Endpoint**: `/api/search`
* **Method**: `GET`
* **Query Parameter**: `query` (term to search for)
* **Example**: `/api/search?query=anatomy`
* **Description**: Searches for subjects matching the keyword in the subject name, course name, or semester name.

---

## 5. Frontend Code Examples (`fetch()`)

You can copy-paste the examples below into your frontend project:

### A. Fetching All Courses
```javascript
async function getAllCourses() {
  try {
    const response = await fetch('http://localhost:5000/api/courses');
    const result = await response.json();
    
    if (result.success) {
      console.log('Courses:', result.data); // Array of courses
    } else {
      console.error('Failed to load courses');
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}
```

### B. Fetching Subjects by Course ID
```javascript
async function getSubjectsByCourse(courseId) {
  try {
    const response = await fetch(`http://localhost:5000/api/courses/${courseId}/subjects`);
    const result = await response.json();
    
    if (result.success) {
      console.log(`Subjects for ${courseId}:`, result.data);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}
```

### C. Fetching Subject Details & Study Resources
```javascript
async function getSubjectDetails(subjectId) {
  try {
    const response = await fetch(`http://localhost:5000/api/subjects/${subjectId}`);
    const result = await response.json();
    
    if (result.success) {
      const subject = result.data.subject;
      const resources = result.data.resources;
      
      console.log('Subject:', subject.name);
      console.log('Syllabus Units:', resources.syllabusUnits);
      console.log('Videos:', resources.videos);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}
```

### D. Searching for a Subject
```javascript
async function searchSubjects(queryText) {
  try {
    const response = await fetch(`http://localhost:5000/api/search?query=${encodeURIComponent(queryText)}`);
    const result = await response.json();
    
    if (result.success) {
      console.log('Search Results:', result.data);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}
```
