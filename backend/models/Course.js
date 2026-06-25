const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  course_id: {
    type: Number,
    required: true,
    unique: true
  },
  course_name: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', CourseSchema);
