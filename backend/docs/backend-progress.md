# Backend Progress Report

## Day 1: Backend Setup

### Completed
- Created backend project folder.
- Created package.json.
- Installed Express, CORS, and dotenv.
- Created server.js and app.js.
- Planned API structure.

### Deliverable
Backend basic server setup completed.

---

## Day 2: Database Design

### Completed
- Designed database schema.
- Created tables:
  - courses
  - semesters
  - subjects
  - subject_resources

### Deliverable
Database schema completed.

---

## Day 3: Course Data Entry

### Completed
- Added B.Pharm course data.
- Added B.Sc Nursing course data.
- Added GNM Nursing course data.
- Organized subjects semester-wise and year-wise.

### Deliverable
Course and subject seed data completed.

---

## Day 4: API Development

### Completed
- Created course routes.
- Created subject routes.
- Created controllers.
- Created search API.
- Created subject resource response containing:
  - Syllabus units
  - Study materials
  - Important topics
  - Videos
  - Practicals
  - Learning process

### APIs Completed

GET /api/health  
GET /api/courses  
GET /api/courses/:courseId  
GET /api/courses/:courseId/semesters  
GET /api/courses/:courseId/semesters/:semesterId/subjects  
GET /api/subjects/:subjectId  
GET /api/search?query=anatomy  

### Tomorrow's Plan
Connect frontend with backend APIs using fetch().
