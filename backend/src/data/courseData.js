function slugify(text) {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const rawCourses = [
  {
    id: "bpharm",
    name: "B.Pharm",
    fullName: "Bachelor of Pharmacy",
    duration: "8 Semesters",
    totalCourses: 40,
    description: "Bachelor of Pharmacy course with pharmacy subjects.",
    semesters: [
      {
        name: "SEM-1",
        subjects: [
          "Human Anatomy and Physiology",
          "Pharmaceutics I (General and Dispensing Pharmacy)",
          "Pharmaceutical Analysis I",
          "Inorganic Medicinal Chemistry",
          "Remedial Mathematics and Biology"
        ]
      },
      {
        name: "SEM-2",
        subjects: [
          "Pharmaceutics II (Unit Operations)",
          "Organic Chemistry",
          "Computer Applications",
          "Human Anatomy and Pathophysiology",
          "Mathematics and Statistics"
        ]
      },
      {
        name: "SEM-3",
        subjects: [
          "Biochemistry",
          "Microbiology and Immunology",
          "Pharmacognosy and Natural Products I",
          "Heterocyclic and Natural Products Chemistry",
          "Pharmaceutics III (Physical Pharmaceutics)"
        ]
      },
      {
        name: "SEM-4",
        subjects: [
          "Pharmacology I",
          "Pharmaceutics IV (Cosmetology)",
          "Pharmacognosy and Natural Products II",
          "Industrial Management and Pharmaceutical Marketing",
          "Pharmaceutical Analysis II"
        ]
      },
      {
        name: "SEM-5",
        subjects: [
          "Medicinal Chemistry I",
          "Pharmacology II",
          "Pharmaceutics V (Biological Pharmacy)",
          "Pharmacognosy and Natural Products III",
          "Hospital Pharmacy"
        ]
      },
      {
        name: "SEM-6",
        subjects: [
          "Medicinal Chemistry II",
          "Pharmaceutics VI (Pharmaceutical Technology I)",
          "Pharmacology III",
          "Pharmaceutical Analysis III",
          "Molecular Biology, Genetics and Biotechnology"
        ]
      },
      {
        name: "SEM-7",
        subjects: [
          "Pharmaceutics VII (Pharmaceutical Technology II)",
          "Pharmacology IV",
          "Forensic Pharmacy",
          "Regulatory and Quality Management",
          "Project Work or Elective Paper"
        ]
      },
      {
        name: "SEM-8",
        subjects: [
          "Pharmaceutics VIII (Biopharmaceutics and Pharmacokinetics)",
          "Clinical Pharmacy and Therapeutics",
          "Pharmaceutical Biotechnology Applications",
          "Internship or Industrial Training",
          "Comprehensive Viva-Voce or Final Project"
        ]
      }
    ]
  },

  {
    id: "bsc-nursing",
    name: "B.Sc Nursing",
    fullName: "Bachelor of Science in Nursing",
    duration: "8 Semesters",
    totalCourses: "30 excluding internship",
    description: "Bachelor of Science in Nursing with nursing subjects.",
    semesters: [
      {
        name: "SEM-1",
        subjects: [
          "Communicative English",
          "Applied Anatomy",
          "Applied Physiology",
          "Applied Sociology",
          "Applied Psychology",
          "Nursing Foundations I"
        ]
      },
      {
        name: "SEM-2",
        subjects: [
          "Applied Biochemistry",
          "Applied Nutrition & Dietetics",
          "Nursing Foundations II",
          "Health/Nursing Informatics & Technology"
        ]
      },
      {
        name: "SEM-3",
        subjects: [
          "Applied Microbiology, and Infection control including Safety",
          "Pharmacology I",
          "Pathology I",
          "Adult Health Nursing I with integrated pathophysiology"
        ]
      },
      {
        name: "SEM-4",
        subjects: [
          "Pharmacology II",
          "Pathology II & Genetics",
          "Adult Health Nursing II with integrated pathophysiology including Geriatrics",
          "Professionalism, Professional values & Ethics including bioethics"
        ]
      },
      {
        name: "SEM-5",
        subjects: [
          "Child Health Nursing I",
          "Mental Health Nursing I",
          "Community Health Nursing I (including Environmental Science & Epidemiology)",
          "Educational Technology/ Nursing Education",
          "Introduction to Forensic Nursing and Indian Laws"
        ]
      },
      {
        name: "SEM-6",
        subjects: [
          "Child Health Nursing II",
          "Mental Health Nursing II",
          "Nursing Management & Leadership",
          "Midwifery/ Obstetrics & Gynaecology I"
        ]
      },
      {
        name: "SEM-7",
        subjects: [
          "Community Health Nursing II",
          "Nursing Research and Statistics",
          "Midwifery/ Obstetrics & Gynaecology II"
        ]
      },
      {
        name: "SEM-8",
        subjects: [
          "Internship (Intensive Practicum/ Residency Posting)"
        ]
      }
    ]
  },

  {
    id: "gnm-nursing",
    name: "GNM Nursing",
    fullName: "General Nursing and Midwifery",
    duration: "6 Semesters / 3 Years",
    totalCourses: 20,
    description: "General Nursing and Midwifery course.",
    semesters: [
      {
        name: "YEAR-1",
        subjects: [
          "Anatomy and Physiology",
          "Psychology",
          "Fundamentals of Nursing",
          "Environmental Hygiene",
          "Nutrition",
          "Microbiology",
          "Sociology",
          "Community Health Nursing I",
          "Health Education and Communication Skills",
          "English"
        ]
      },
      {
        name: "YEAR-2",
        subjects: [
          "Medical Surgical Nursing I",
          "Mental Health Nursing",
          "Medical-Surgical Nursing II",
          "Child Health Nursing"
        ]
      },
      {
        name: "YEAR-3",
        subjects: [
          "Community Health Nursing II",
          "Introduction to Research",
          "Professional Trends and Adjustment",
          "Midwifery and Gynaecological Nursing",
          "Administration and Ward Management",
          "Training and Internship"
        ]
      }
    ]
  }
];

const courses = rawCourses.map(course => ({
  ...course,
  semesters: course.semesters.map(semester => ({
    ...semester,
    id: `${course.id}-${slugify(semester.name)}`,
    subjects: semester.subjects.map(subject => ({
      id: `${course.id}-${slugify(semester.name)}-${slugify(subject)}`,
      name: subject
    }))
  }))
}));

function getAllCourses() {
  return courses;
}

function getCourseById(courseId) {
  return courses.find(course => course.id === courseId);
}

function getAllSubjects() {
  const subjects = [];

  courses.forEach(course => {
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
  });

  return subjects;
}

function getSubjectById(subjectId) {
  return getAllSubjects().find(subject => subject.id === subjectId);
}

// Check mapping if any references look for lowercase or uppercase, but standard exports here:
module.exports = {
  getAllCourses,
  getCourseById,
  getAllSubjects,
  getSubjectById
};
