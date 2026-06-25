const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  subject_id: {
    type: Number,
    required: true,
    unique: true
  },
  course_id: {
    type: Number,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  subject_name: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subject', SubjectSchema);
