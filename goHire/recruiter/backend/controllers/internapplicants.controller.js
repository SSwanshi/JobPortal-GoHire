const AppliedInternship = require('../models/AppliedInternship');
const Internship = require('../models/Internship');
const PremiumUser = require('../models/PremiumUser');
const mongoose = require('mongoose');

const getInternshipApplications = async (req, res) => {
  try {
    const internshipId = req.params.internshipId;

    const internship = await Internship.findById(internshipId).populate("intCompany");
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    // Try finding by internshipId as string first
    let allApplicants = await AppliedInternship.find({ internshipId });
    
    // If no results, try with internshipId as ObjectId (if it's a valid ObjectId string)
    if (allApplicants.length === 0 && mongoose.Types.ObjectId.isValid(internshipId)) {
      try {
        allApplicants = await AppliedInternship.find({ internshipId: new mongoose.Types.ObjectId(internshipId) });
      } catch (err) {
        // Silently fall through to next attempt
      }
    }
    
    // Also try exact string match
    if (allApplicants.length === 0) {
      allApplicants = await AppliedInternship.find({ internshipId: internshipId.toString() });
    }

    const premiumUsers = await PremiumUser.find({}, 'userId');
    const premiumUserIds = premiumUsers.map(user => user.userId);

    const premiumApplicants = [];
    const normalApplicants = [];

    allApplicants.forEach(applicant => {
      if (premiumUserIds.includes(applicant.userId)) {
        premiumApplicants.push(applicant);
      } else {
        normalApplicants.push(applicant);
      }
    });

    const sortedApplicants = [...premiumApplicants, ...normalApplicants];

    res.json({
      success: true,
      intapplicants: sortedApplicants,
      intTitle: internship.intTitle,
      intCompany: internship.intCompany.companyName,
      internshipId
    });
  } catch (err) {
    console.error('Error fetching internship applications:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Internal Server Error'
    });
  }
};

const selectApplicant = async (req, res) => {
  try {
    const { internshipId, applicantId } = req.params;
    await AppliedInternship.findOneAndUpdate(
      { _id: applicantId, internshipId },
      { isSelected: true, isRejected: false }
    );
    res.json({ success: true, message: 'Applicant selected successfully' });
  } catch (error) {
    console.error('Error selecting applicant:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const rejectApplicant = async (req, res) => {
  try {
    const { internshipId, applicantId } = req.params;
    await AppliedInternship.findOneAndUpdate(
      { _id: applicantId, internshipId },
      { isRejected: true, isSelected: false }
    );
    res.json({ success: true, message: 'Applicant rejected successfully' });
  } catch (error) {
    console.error('Error rejecting applicant:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const getResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    // This would need to connect to applicant DB to fetch resume from GridFS
    res.status(501).json({ success: false, message: 'Resume fetching not yet implemented' });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = {
  getInternshipApplications,
  selectApplicant,
  rejectApplicant,
  getResume
};

