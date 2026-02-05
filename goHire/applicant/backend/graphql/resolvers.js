const User = require('../models/user');
const PremiumUser = require('../models/premium_user');
const Applied_for_Jobs = require('../models/Applied_for_Jobs');
const Applied_for_Internships = require('../models/Applied_for_Internships');
const { getBucket } = require('../config/db');
const { ObjectId } = require('mongodb');
const connectRecruiterDB = require('../config/recruiterDB');
const createJobModel = require('../models/recruiter/Job');
const createInternshipModel = require('../models/recruiter/Internships');
const createCompanyModel = require('../models/recruiter/Company');
const bcrypt = require('bcrypt');
const { generateToken } = require('../config/jwt');
const { GraphQLError } = require('graphql');

const resolvers = {
  Query: {
    // Health check
    health: () => 'GraphQL API is running!',

    // Get current authenticated user
    me: async (_, __, { user }) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const userData = await User.findOne({ userId: user.id });
      if (!userData) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      return userData;
    },

    // Get full profile with application history
    getProfile: async (_, __, { user }) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      try {
        const userData = await User.findOne({ userId: user.id });
        if (!userData) {
          throw new GraphQLError('User not found', {
            extensions: { code: 'NOT_FOUND' }
          });
        }

        // Check if user is premium
        const premiumUser = await PremiumUser.findOne({ email: userData.email });
        const isPremium = !!premiumUser;

        let resumeName = null;
        if (userData.resumeId) {
          const bucket = getBucket();
          const files = await bucket.find({ _id: new ObjectId(userData.resumeId) }).toArray();
          if (files.length > 0) resumeName = files[0].filename;
        }

        // Get applications
        const jobApplications = await Applied_for_Jobs.find({ userId: user.id });
        const internshipApplications = await Applied_for_Internships.find({ userId: user.id });

        const jobIds = [...new Set(jobApplications.map(app => app.jobId).filter(Boolean))];
        const internshipIds = [...new Set(internshipApplications.map(app => app.internshipId).filter(Boolean))];

        const recruiterConn = await connectRecruiterDB();
        const JobFindConn = createJobModel(recruiterConn);
        const InternshipFindConn = createInternshipModel(recruiterConn);
        const CompanyFindConn = createCompanyModel(recruiterConn);

        const [jobs, internships] = await Promise.all([
          jobIds.length > 0 ? JobFindConn.find({ _id: { $in: jobIds } }) : [],
          internshipIds.length > 0 ? InternshipFindConn.find({ _id: { $in: internshipIds } }) : []
        ]);

        const jobCompanyIds = [...new Set(jobs.map(job => job.jobCompany).filter(Boolean))];
        const companies = jobCompanyIds.length > 0
          ? await CompanyFindConn.find({ _id: { $in: jobCompanyIds } })
          : [];

        const companyMap = companies.reduce((map, company) => {
          map[company._id.toString()] = company;
          return map;
        }, {});

        const internshipCompanyIds = [...new Set(internships.map(int => int.intCompany).filter(Boolean))];
        const internshipCompanies = internshipCompanyIds.length > 0
          ? await CompanyFindConn.find({ _id: { $in: internshipCompanyIds } })
          : [];

        const internshipCompanyMap = internshipCompanies.reduce((map, company) => {
          map[company._id.toString()] = company;
          return map;
        }, {});

        const jobMap = jobs.reduce((map, job) => {
          map[job._id] = job;
          return map;
        }, {});

        const internshipMap = internships.reduce((map, internship) => {
          map[internship._id] = internship;
          return map;
        }, {});

        const applicationHistory = [
          ...jobApplications.map(app => {
            const job = app.jobId ? jobMap[app.jobId] : null;
            const company = job?.jobCompany ? companyMap[job.jobCompany.toString()] : null;
            return {
              type: 'Job',
              title: job?.jobTitle || 'Job No Longer Available',
              company: company?.companyName || 'Company No Longer Available',
              appliedAt: app.AppliedAt?.toISOString() || new Date().toISOString(),
              status: app.isSelected ? 'Accepted' : app.isRejected ? 'Rejected' : 'Pending',
              applicationId: app._id.toString()
            };
          }),
          ...internshipApplications.map(app => {
            const internship = app.internshipId ? internshipMap[app.internshipId] : null;
            const company = internship?.intCompany ? internshipCompanyMap[internship.intCompany.toString()] : null;
            return {
              type: 'Internship',
              title: internship?.intTitle || 'Internship No Longer Available',
              company: company?.companyName || 'Company No Longer Available',
              appliedAt: app.AppliedAt?.toISOString() || new Date().toISOString(),
              status: app.isSelected ? 'Accepted' : app.isRejected ? 'Rejected' : 'Pending',
              applicationId: app._id.toString()
            };
          })
        ];

        applicationHistory.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

        return {
          user: userData,
          isPremium,
          resumeName,
          applicationHistory
        };

      } catch (error) {
        console.error('Profile GraphQL error:', error);
        throw new GraphQLError('Failed to fetch profile', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    }
  },

  Mutation: {
    // Signup mutation
    signup: async (_, { input }) => {
      const { firstName, lastName, email, phone, gender, password, confirmPassword } = input;

      try {
        // Validation
        if (!firstName || !lastName || !email || !phone || !gender || !password || !confirmPassword) {
          throw new GraphQLError('All fields are required', {
            extensions: { code: 'BAD_USER_INPUT' }
          });
        }

        if (password.length < 4) {
          throw new GraphQLError('Password must be at least 4 characters long', {
            extensions: { code: 'BAD_USER_INPUT' }
          });
        }

        if (password !== confirmPassword) {
          throw new GraphQLError('Passwords do not match', {
            extensions: { code: 'BAD_USER_INPUT' }
          });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new GraphQLError('Email already registered', {
            extensions: { code: 'BAD_USER_INPUT' }
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          firstName,
          lastName,
          email,
          phone,
          gender,
          password: hashedPassword
        });

        await newUser.save();

        return {
          success: true,
          message: 'Signup successful! Please login.',
          token: null,
          user: null,
          require2FA: false
        };

      } catch (err) {
        console.error('Signup GraphQL error:', err);
        if (err instanceof GraphQLError) {
          throw err;
        }
        throw new GraphQLError('Server error. Please try again.', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },

    // Login mutation
    login: async (_, { input }) => {
      const { email, password } = input;

      try {
        // Validation
        if (!email || !password) {
          throw new GraphQLError('Email and password are required', {
            extensions: { code: 'BAD_USER_INPUT' }
          });
        }

        const user = await User.findOne({ email });
        if (!user) {
          throw new GraphQLError('Invalid email or password', {
            extensions: { code: 'UNAUTHENTICATED' }
          });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new GraphQLError('Invalid email or password', {
            extensions: { code: 'UNAUTHENTICATED' }
          });
        }

        // Check if 2FA is enabled
        if (user.twoFactorEnabled) {
          return {
            success: true,
            require2FA: true,
            email: user.email,
            message: 'OTP sent to your email for 2-factor authentication',
            token: null,
            user: null
          };
        }

        // Generate JWT token
        const token = generateToken({
          id: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        });

        return {
          success: true,
          message: 'Login successful!',
          token,
          user: {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            gender: user.gender
          },
          require2FA: false
        };

      } catch (err) {
        console.error('Login GraphQL error:', err);
        if (err instanceof GraphQLError) {
          throw err;
        }
        throw new GraphQLError('Server error. Please try again.', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },

    // Update profile mutation
    updateProfile: async (_, { input }, { user }) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      try {
        const updateData = {};

        // Only update fields that are provided
        if (input.firstName) updateData.firstName = input.firstName;
        if (input.lastName) updateData.lastName = input.lastName;
        if (input.phone) updateData.phone = input.phone;
        if (input.collegeName !== undefined) updateData.collegeName = input.collegeName;
        if (input.skills !== undefined) updateData.skills = input.skills;
        if (input.about !== undefined) updateData.about = input.about;
        if (input.linkedinProfile !== undefined) updateData.linkedinProfile = input.linkedinProfile;
        if (input.githubProfile !== undefined) updateData.githubProfile = input.githubProfile;
        if (input.portfolioWebsite !== undefined) updateData.portfolioWebsite = input.portfolioWebsite;
        if (input.workExperience !== undefined) updateData.workExperience = input.workExperience;
        if (input.achievements !== undefined) updateData.achievements = input.achievements;

        const updatedUser = await User.findOneAndUpdate(
          { userId: user.id },
          updateData,
          { new: true }
        );

        if (!updatedUser) {
          throw new GraphQLError('User not found', {
            extensions: { code: 'NOT_FOUND' }
          });
        }

        return updatedUser;

      } catch (err) {
        console.error('Update profile GraphQL error:', err);
        if (err instanceof GraphQLError) {
          throw err;
        }
        throw new GraphQLError('Failed to update profile', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    }
  }
};

module.exports = resolvers;
