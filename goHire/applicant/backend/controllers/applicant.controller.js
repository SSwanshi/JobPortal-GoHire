const mongoose = require("mongoose");
const axios = require("axios");
const connectRecruiterDB = require("../config/recruiterDB");
const createJobModel = require("../models/recruiter/Job");
const createInternshipModel = require("../models/recruiter/Internships");
const createCompanyModel = require("../models/recruiter/Company");
const User = require("../models/user");
const Applied_for_Jobs = require("../models/Applied_for_Jobs");
const Applied_for_Internships = require("../models/Applied_for_Internships");
const Fuse = require("fuse.js");

const getJobs = async (req, res) => {
  try {
    const recruiterConn = await connectRecruiterDB();
    const JobFindConn = createJobModel(recruiterConn);
    const CompanyModel = createCompanyModel(recruiterConn);
    const {
      salary1,
      salary2,
      salary3,
      salary4,
      exp1,
      exp2,
      exp3,
      exp4,
      exp5,
      exp6,
    } = req.query;
    const query = {};

    // salary filters
    if (salary1) query.salary = { $lt: 10 };
    else if (salary2) query.salary = { $gte: 10, $lte: 20 };
    else if (salary3) query.salary = { $gte: 20, $lte: 30 };
    else if (salary4) query.salary = { $gt: 30 };

    // experience filters
    if (exp1) query.experience = 0;
    else if (exp2) query.experience = { $lt: 1 };
    else if (exp3) query.experience = { $gte: 1, $lte: 3 };
    else if (exp4) query.experience = { $gte: 3, $lte: 5 };
    else if (exp5) query.experience = { $gte: 5, $lte: 10 };
    else if (exp6) query.experience = { $gt: 10 };

    const JobFind = await JobFindConn.find({query})
      .populate({
        path: "jobCompany",
        strictPopulate: false,
      })
      .lean();

    res.status(200).json({
      message: "success",
      results: JobFind.length,
      jobs: JobFind,
    });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getInternships = async (req, res) => {
  try {
    const recruiterConn = await connectRecruiterDB();
    const InternshipFindConn = createInternshipModel(recruiterConn);
    const CompanyModel = createCompanyModel(recruiterConn);

    const InternshipFind = await InternshipFindConn.find({})
      .populate({
        path: "intCompany",
        strictPopulate: false,
      })
      .lean();

    res.json(InternshipFind);
  } catch (err) {
    console.error("Error fetching internships:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCompanies = async (req, res) => {
  try {
    const recruiterConn = await connectRecruiterDB();
    const CompanyModel = createCompanyModel(recruiterConn);
    const companies = await CompanyModel.find({ verified: true }).lean();
    res.json(companies);
  } catch (err) {
    console.error("Error fetching companies:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const filterJobs = async (req, res) => {
  try {
    const {
      salary1,
      salary2,
      salary3,
      salary4,
      exp1,
      exp2,
      exp3,
      exp4,
      exp5,
      exp6,
    } = req.body;

    const recruiterConn = await connectRecruiterDB();
    const JobFindConn = createJobModel(recruiterConn);
    const CompanyModel = createCompanyModel(recruiterConn);

    const query = {};

    // Salary Range Filters
    let salaryConditions = [];
    if (salary1) salaryConditions.push({ jobSalary: { $lt: 10 } });
    if (salary2) salaryConditions.push({ jobSalary: { $gte: 10, $lte: 20 } });
    if (salary3) salaryConditions.push({ jobSalary: { $gte: 20, $lte: 30 } });
    if (salary4) salaryConditions.push({ jobSalary: { $gte: 30 } });

    if (salaryConditions.length > 0) {
      query.$or = salaryConditions;
    }

    // Experience Filter
    let expConditions = [];
    if (exp1) expConditions.push({ jobExperience: 0 });
    if (exp2) expConditions.push({ jobExperience: { $lt: 1 } });
    if (exp3) expConditions.push({ jobExperience: { $gte: 1, $lte: 3 } });
    if (exp4) expConditions.push({ jobExperience: { $gte: 3, $lte: 5 } });
    if (exp5) expConditions.push({ jobExperience: { $gte: 5, $lte: 10 } });
    if (exp6) expConditions.push({ jobExperience: { $gt: 10 } });

    if (expConditions.length > 0) {
      query.$and = query.$and || [];
      query.$and.push({ $or: expConditions });
    }

    const JobFind = await JobFindConn.find(query)
      .populate({
        path: "jobCompany",
        strictPopulate: false,
      })
      .lean();

    res.json(JobFind);
  } catch (err) {
    console.error("Error filtering jobs:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const filterInternships = async (req, res) => {
  try {
    const { dur1, dur2, dur3, dur4 } = req.body;

    const recruiterConn = await connectRecruiterDB();
    const InternshipFindConn = createInternshipModel(recruiterConn);
    const CompanyModel = createCompanyModel(recruiterConn);

    const query = {};

    // Duration filter
    let durConditions = [];
    if (dur1) durConditions.push({ intDuration: { $lte: 1 } });
    if (dur2) durConditions.push({ intDuration: { $gt: 1, $lte: 3 } });
    if (dur3) durConditions.push({ intDuration: { $gt: 3, $lte: 6 } });
    if (dur4) durConditions.push({ intDuration: { $gt: 6 } });

    if (durConditions.length > 0) {
      query.$or = durConditions;
    }

    const InternshipFind = await InternshipFindConn.find(query)
      .populate({
        path: "intCompany",
        strictPopulate: false,
      })
      .lean();

    res.json(InternshipFind);
  } catch (err) {
    console.error("Error filtering internships:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const recruiterConn = await connectRecruiterDB();
    const JobFindConn = createJobModel(recruiterConn);

    const job = await JobFindConn.findById(jobId)
      .populate({
        path: "jobCompany",
        strictPopulate: false,
      })
      .lean();

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    console.error("Error fetching job:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getInternshipById = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const recruiterConn = await connectRecruiterDB();
    const InternshipFindConn = createInternshipModel(recruiterConn);

    const internship = await InternshipFindConn.findById(internshipId)
      .populate({
        path: "intCompany",
        strictPopulate: false,
      })
      .lean();

    if (!internship) {
      return res.status(404).json({ error: "Internship not found" });
    }

    res.json(internship);
  } catch (err) {
    console.error("Error fetching internship:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const applyForJob = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const { jobId } = req.params;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Please login to apply for this job." });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.resumeId) {
      return res
        .status(400)
        .json({ error: "Please upload Resume to apply for this job." });
    }

    const alreadyApplied = await Applied_for_Jobs.findOne({ userId, jobId });
    if (alreadyApplied) {
      return res
        .status(400)
        .json({ error: "You have already applied for this job." });
    }

    const recruiterConn = await connectRecruiterDB();
    const JobFindConn = createJobModel(recruiterConn);
    const job = await JobFindConn.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const application = new Applied_for_Jobs({
      userId,
      jobId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      password: user.password,
      resumeId: user.resumeId,
      memberSince: user.memberSince,
    });

    await application.save();

    res.json({ success: true, message: "Application submitted successfully" });
  } catch (err) {
    console.error("Error applying for job:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

const checkInternshipApplication = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const { internshipId } = req.params;

    const recruiterConn = await connectRecruiterDB();
    const InternshipFindConn = createInternshipModel(recruiterConn);
    const internship = await InternshipFindConn.findById(internshipId)
      .populate({
        path: "intCompany",
        strictPopulate: false,
      })
      .lean();

    if (!internship) {
      return res.status(404).json({ error: "Internship not found" });
    }

    const alreadyApplied = userId
      ? await Applied_for_Internships.findOne({ userId, internshipId })
      : null;

    res.json({
      internship,
      alreadyApplied: !!alreadyApplied,
    });
  } catch (err) {
    console.error("Error checking internship application:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const applyForInternship = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const { internshipId } = req.params;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Please login to apply for this internship." });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.resumeId) {
      return res
        .status(400)
        .json({ error: "Please upload Resume to apply for this internship." });
    }

    const alreadyApplied = await Applied_for_Internships.findOne({
      userId,
      internshipId,
    });
    if (alreadyApplied) {
      return res
        .status(400)
        .json({ error: "You have already applied for this internship." });
    }

    const recruiterConn = await connectRecruiterDB();
    const InternshipFindConn = createInternshipModel(recruiterConn);
    const internship = await InternshipFindConn.findById(internshipId);

    if (!internship) {
      return res.status(404).json({ error: "Internship not found" });
    }

    const application = new Applied_for_Internships({
      userId,
      internshipId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      password: user.password,
      resumeId: user.resumeId,
      memberSince: user.memberSince,
    });

    await application.save();

    res.json({ success: true, message: "Application submitted successfully" });
  } catch (err) {
    console.error("Error applying for internship:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const applications = await Applied_for_Jobs.find({ userId }).lean();
    res.json(applications);
  } catch (err) {
    console.error("Error fetching applied jobs:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAppliedInternships = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const applications = await Applied_for_Internships.find({ userId }).lean();
    res.json(applications);
  } catch (err) {
    console.error("Error fetching applied internships:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getLogo = async (req, res) => {
  try {
    const logoId = req.params.logoId;
    const response = await axios({
      method: "get",
      url: `http://localhost:5000/recruiter/logo/${logoId}`,
      responseType: "stream",
    });

    res.setHeader("Content-Type", response.headers["content-type"]);
    response.data.pipe(res);
  } catch (error) {
    console.error("Error proxying logo:", error.message);
    res.status(500).json({ error: "Failed to fetch logo" });
  }
};

module.exports = {
  getJobs,
  getInternships,
  getCompanies,
  filterJobs,
  filterInternships,
  getJobById,
  getInternshipById,
  applyForJob,
  checkInternshipApplication,
  applyForInternship,
  getAppliedJobs,
  getAppliedInternships,
  getLogo,
};
