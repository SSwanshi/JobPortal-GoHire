const AppliedJob = require('../models/AppliedJob');
const Job = require('../models/Jobs');
const PremiumUser = require('../models/PremiumUser');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const { connectApplicantDB } = require('../config/applicantDb');

// Note: This assumes PremiumUser model exists in applicant DB
// You may need to connect to applicant DB to fetch premium users

const getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Ensure applicant database connection is established
    await connectApplicantDB();

    const job = await Job.findById(jobId).populate("jobCompany");
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    console.log(`[DEBUG] Searching for applications with jobId: ${jobId} (type: ${typeof jobId})`);

    // Try multiple query formats to handle different jobId storage formats
    let applicants = [];
    
    // Try 1: Direct string match
    applicants = await AppliedJob.find({ jobId: jobId });
    console.log(`[DEBUG] Query 1 (jobId: "${jobId}"): Found ${applicants.length} applicants`);
    
    // Try 2: String match with toString()
    if (applicants.length === 0) {
      applicants = await AppliedJob.find({ jobId: jobId.toString() });
      console.log(`[DEBUG] Query 2 (jobId.toString()): Found ${applicants.length} applicants`);
    }
    
    // Try 3: ObjectId match (if valid ObjectId)
    if (applicants.length === 0 && mongoose.Types.ObjectId.isValid(jobId)) {
      try {
        applicants = await AppliedJob.find({ jobId: new mongoose.Types.ObjectId(jobId) });
        console.log(`[DEBUG] Query 3 (ObjectId): Found ${applicants.length} applicants`);
      } catch (err) {
        console.log(`[DEBUG] Query 3 failed: ${err.message}`);
      }
    }
    
    // Try 4: ObjectId as string (common format)
    if (applicants.length === 0 && mongoose.Types.ObjectId.isValid(jobId)) {
      try {
        const objectIdString = new mongoose.Types.ObjectId(jobId).toString();
        applicants = await AppliedJob.find({ jobId: objectIdString });
        console.log(`[DEBUG] Query 4 (ObjectId.toString()): Found ${applicants.length} applicants`);
      } catch (err) {
        console.log(`[DEBUG] Query 4 failed: ${err.message}`);
      }
    }
    
    // Try 5: Find all and filter (last resort - for debugging)
    if (applicants.length === 0) {
      const allApplicants = await AppliedJob.find({});
      console.log(`[DEBUG] Total applicants in DB: ${allApplicants.length}`);
      if (allApplicants.length > 0) {
        console.log(`[DEBUG] Sample jobId from DB: "${allApplicants[0].jobId}" (type: ${typeof allApplicants[0].jobId})`);
        // Try to find matches manually
        applicants = allApplicants.filter(app => 
          app.jobId === jobId || 
          app.jobId === jobId.toString() ||
          (mongoose.Types.ObjectId.isValid(jobId) && app.jobId === new mongoose.Types.ObjectId(jobId).toString()) ||
          (mongoose.Types.ObjectId.isValid(app.jobId) && mongoose.Types.ObjectId.isValid(jobId) && 
           new mongoose.Types.ObjectId(app.jobId).equals(new mongoose.Types.ObjectId(jobId)))
        );
        console.log(`[DEBUG] Query 5 (filtered): Found ${applicants.length} applicants`);
      }
    }

    // Fetch premium user IDs (assuming they're in the same DB or need connection to applicant DB)
    const premiumUsers = await PremiumUser.find({}, 'userId');
    const premiumUserIds = premiumUsers.map(user => user.userId);

    // Sort applicants: premium first
    const premiumApplicants = [];
    const normalApplicants = [];

    applicants.forEach(applicant => {
      if (premiumUserIds.includes(applicant.userId)) {
        premiumApplicants.push(applicant);
      } else {
        normalApplicants.push(applicant);
      }
    });

    const sortedApplicants = [...premiumApplicants, ...normalApplicants];

    res.json({
      success: true,
      applicants: sortedApplicants,
      jobTitle: job.jobTitle,
      jobCompany: job.jobCompany.companyName,
      jobId
    });
  } catch (err) {
    console.error('Error fetching job applications:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Internal Server Error'
    });
  }
};

const selectApplicant = async (req, res) => {
  try {
    // Ensure applicant database connection is established
    await connectApplicantDB();
    
    const { jobId, applicantId } = req.params;
    const result = await AppliedJob.findOneAndUpdate(
      { _id: applicantId, jobId },
      { isSelected: true, isRejected: false },
      { new: true }
    );
    
    if (!result) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    res.json({ success: true, message: 'Applicant selected successfully' });
  } catch (error) {
    console.error('Error selecting applicant:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const rejectApplicant = async (req, res) => {
  try {
    // Ensure applicant database connection is established
    await connectApplicantDB();
    
    const { jobId, applicantId } = req.params;
    const result = await AppliedJob.findOneAndUpdate(
      { _id: applicantId, jobId },
      { isRejected: true, isSelected: false },
      { new: true }
    );
    
    if (!result) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    res.json({ success: true, message: 'Applicant rejected successfully' });
  } catch (error) {
    console.error('Error rejecting applicant:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const getResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { ObjectId } = require('mongodb');
    const { connectApplicantDB, getApplicantBucket } = require('../config/applicantDb');

    // Ensure applicant database connection is established
    await connectApplicantDB();
    const bucket = getApplicantBucket();

    if (!bucket) {
      return res.status(500).json({ success: false, error: 'Applicant database connection not available' });
    }

    if (!ObjectId.isValid(resumeId)) {
      return res.status(400).json({ success: false, error: 'Invalid resume ID' });
    }

    const resumeObjectId = new ObjectId(resumeId);

    // Check if file exists
    const files = await bucket.find({ _id: resumeObjectId }).toArray();
    if (files.length === 0) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    const file = files[0];

    // Set appropriate headers
    res.set('Content-Type', file.contentType || 'application/pdf');
    res.set('Content-Disposition', `inline; filename="${file.filename || 'resume.pdf'}"`);
    res.set('Content-Length', file.length);

    // Stream the file
    const downloadStream = bucket.openDownloadStream(resumeObjectId);
    
    downloadStream.on('error', (error) => {
      console.error('Error streaming resume:', error);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: 'Error downloading resume' });
      }
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error fetching resume:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
};

module.exports = {
  getJobApplications,
  selectApplicant,
  rejectApplicant,
  getResume
};

