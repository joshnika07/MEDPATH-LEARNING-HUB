const mongoose = require('mongoose');

const LearningContentSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  syllabus: {
    type: [String],
    default: []
  },
  importantTopics: {
    type: [String],
    default: []
  },
  videos: {
    type: [String],
    default: []
  },
  materials: {
    type: [String],
    default: []
  },
  practicals: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LearningContent', LearningContentSchema);
