const mongoose = require('mongoose');
const Job = require('../models/Jobs');
const Company = require('../models/Companies');

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.userId }).populate("jobCompany");
    res.json({ success: true, jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch jobs' });
  }
};

const addJob = async (req, res) => {
  try {
    const {
      jobTitle,
      jobDescription,
      jobRequirements,
      jobSalary,
      jobLocation,
      jobType,
      jobExperience,
      noofPositions,
      jobCompany,
      jobExpiry
    } = req.body;

    if (!jobTitle || !jobDescription || !jobRequirements || !jobSalary ||
      !jobLocation || !jobType || !jobExperience || !noofPositions || !jobCompany || !jobExpiry) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const companyExists = await Company.findOne({
      _id: jobCompany,
      createdBy: req.userId,
      verified: true
    });

    if (!companyExists) {
      return res.status(400).json({ success: false, message: "Company must be verified to post a job." });
    }

    const newJob = new Job({
      jobTitle,
      jobDescription,
      jobRequirements,
      jobSalary: parseFloat(jobSalary),
      jobLocation,
      jobType,
      jobExperience: parseInt(jobExperience),
      noofPositions: parseInt(noofPositions),
      jobCompany: new mongoose.Types.ObjectId(jobCompany),
      createdBy: req.userId,
      jobExpiry: new Date(jobExpiry)
    });

    await newJob.save();
    res.json({ success: true, message: "Job added successfully!", job: newJob });
  } catch (error) {
    console.error("Error adding job:", error);
    res.status(500).json({ success: false, message: "Failed to add job" });
  }
};

const getEditJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("jobCompany");
    const companies = await Company.find({ createdBy: req.userId });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, job, companies });
  } catch (err) {
    console.error("Error loading edit job page:", err);
    res.status(500).json({ success: false, error: 'Failed to fetch job' });
  }
};

const updateJob = async (req, res) => {
  try {
    const {
      jobTitle,
      jobDescription,
      jobRequirements,
      jobSalary,
      jobLocation,
      jobType,
      jobExperience,
      noofPositions,
      jobCompany,
      jobExpiry
    } = req.body;

    const updateData = {
      jobTitle,
      jobDescription,
      jobRequirements,
      jobSalary: parseFloat(jobSalary),
      jobLocation,
      jobType,
      jobExperience: parseInt(jobExperience),
      noofPositions: parseInt(noofPositions),
      jobCompany,
      jobExpiry: new Date(jobExpiry)
    };

    const job = await Job.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, message: "Job updated successfully!", job });
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({ success: false, message: 'Failed to update job' });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ success: false, message: 'Failed to delete job' });
  }
};

module.exports = {
  getJobs,
  addJob,
  getEditJob,
  updateJob,
  deleteJob
};

