const mongoose = require('mongoose');
const { getApplicantConnection } = require('../config/applicantDb');

// Schema definition
const AppliedInternshipSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  internshipId: { type: String, required: true },
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
function getAppliedInternshipModel() {
  try {
    const applicantConn = getApplicantConnection();
    const connection = applicantConn || mongoose;
    
    // Check if model already exists on this connection
    if (connection.models && connection.models.AppliedInternship) {
      return connection.models.AppliedInternship;
    }
    
    // Create model on the appropriate connection
    return connection.model('AppliedInternship', AppliedInternshipSchema);
  } catch (error) {
    console.error('Error getting AppliedInternship model:', error);
    // Fallback to default mongoose connection
    if (mongoose.models && mongoose.models.AppliedInternship) {
      return mongoose.models.AppliedInternship;
    }
    return mongoose.model('AppliedInternship', AppliedInternshipSchema);
  }
}

// Export a wrapper that gets the model each time
module.exports = {
  find: function(query) {
    return getAppliedInternshipModel().find(query);
  },
  findOne: function(query) {
    return getAppliedInternshipModel().findOne(query);
  },
  findById: function(id) {
    return getAppliedInternshipModel().findById(id);
  },
  findOneAndUpdate: function(query, update) {
    return getAppliedInternshipModel().findOneAndUpdate(query, update);
  },
  create: function(data) {
    return getAppliedInternshipModel().create(data);
  },
  deleteOne: function(query) {
    return getAppliedInternshipModel().deleteOne(query);
  },
  countDocuments: function(query) {
    return getAppliedInternshipModel().countDocuments(query);
  }
};
