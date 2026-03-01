const Fuse = require('fuse.js');
const connectRecruiterDB = require('../config/recruiterDB');
const createJobModel = require('../models/recruiter/Job');
const createInternshipModel = require('../models/recruiter/Internships');
const createCompanyModel = require('../models/recruiter/Company');

const search = async (req, res) => {
  try {
    const { parsedValue } = req.body;
    const enteredValue = parsedValue;

    const recruiterConn = await connectRecruiterDB();
    const JobFindConn = createJobModel(recruiterConn);
    const InternshipFindConn = createInternshipModel(recruiterConn);
    const CompanyModel = createCompanyModel(recruiterConn);

    const JobFind = await JobFindConn.find({}).populate({
      path: 'jobCompany',
      strictPopulate: false
    }).lean();

    const options1 = {
      // Include all fields that appear on the job card so that
      // any substring match in visible content can surface the job.
      keys: [
        {
          name: 'companyName',
          getFn: (obj) => (obj.jobCompany ? obj.jobCompany.companyName || '' : ''),
        },
        'jobTitle',
        'jobLocation',
        'jobType',
        'jobDescription',
        'jobRequirements',
        'jobExperience',
        'noofPositions',
        'jobSalary',
        'jobExpiry',
        // Custom "label" to allow matching on the word "LPA"
        {
          name: 'salaryLabel',
          getFn: (obj) =>
            obj.jobSalary !== undefined && obj.jobSalary !== null
              ? `${obj.jobSalary} LPA`
              : '',
        },
      ],
      threshold: 0.3,
      includeScore: true,
    };

    const fuse1 = new Fuse(JobFind, options1);
    function searchJobs(enteredValue) {
      if (!enteredValue) return [];
      const results1 = fuse1.search(enteredValue);
      return results1.map(result => result.item);
    }
    const resultValue1 = searchJobs(enteredValue);

    const InternshipFind = await InternshipFindConn.find({}).populate({
      path: 'intCompany',
      strictPopulate: false
    }).lean();

    const options2 = {
      // Include all fields that appear on the internship card
      keys: [
        {
          name: 'companyName',
          getFn: (obj) => (obj.intCompany ? obj.intCompany.companyName || '' : ''),
        },
        'intTitle',
        'intLocation',
        'intDescription',
        'intRequirements',
        'intDuration',
        'intExperience',
        'intPositions',
        'intStipend',
        'intExpiry',
      ],
      threshold: 0.3,
      includeScore: true,
    };

    const fuse2 = new Fuse(InternshipFind, options2);

    function searchIntern(enteredValue) {
      if (!enteredValue) return [];
      const results2 = fuse2.search(enteredValue);
      return results2.map(result => result.item);
    }

    const resultValue2 = searchIntern(enteredValue);

    res.json({
      query: enteredValue,
      jobs: resultValue1,
      internships: resultValue2
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  search
};