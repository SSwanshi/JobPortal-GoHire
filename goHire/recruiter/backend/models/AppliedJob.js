const mongoose = require('mongoose');
const { getApplicantConnection } = require('../config/applicantDb');

// Schema definition
const AppliedJobSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  jobId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' },
  AppliedAt: { type: Date, default: Date.now },
  isSelected: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false }
}, { timestamps: true });

// Get the appropriate connection to create the model (called at runtime)
function getAppliedJobModel() {
  try {
    const applicantConn = getApplicantConnection();
    const connection = applicantConn || mongoose;
    
    // Check if model already exists on this connection
    if (connection.models && connection.models.AppliedJob) {
      return connection.models.AppliedJob;
    }
    
    // Create model on the appropriate connection
    return connection.model('AppliedJob', AppliedJobSchema);
  } catch (error) {
    console.error('Error getting AppliedJob model:', error);
    // Fallback to default mongoose connection
    if (mongoose.models && mongoose.models.AppliedJob) {
      return mongoose.models.AppliedJob;
    }
    return mongoose.model('AppliedJob', AppliedJobSchema);
  }
}

// Export a wrapper that gets the model each time
module.exports = {
  find: function(query) {
    return getAppliedJobModel().find(query);
  },
  findOne: function(query) {
    return getAppliedJobModel().findOne(query);
  },
  findById: function(id) {
    return getAppliedJobModel().findById(id);
  },
  findOneAndUpdate: function(query, update) {
    return getAppliedJobModel().findOneAndUpdate(query, update);
  },
  create: function(data) {
    return getAppliedJobModel().create(data);
  },
  deleteOne: function(query) {
    return getAppliedJobModel().deleteOne(query);
  },
  countDocuments: function(query) {
    return getAppliedJobModel().countDocuments(query);
  }
};
