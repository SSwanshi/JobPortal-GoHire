const mongoose = require('mongoose');
require('dotenv').config();
const { connectDB } = require('../config/db');
const deleteExpiredJobs = require('../routes/jobCleanup');
const deleteExpiredInternship = require('../routes/intCleanup');
const User = require('../models/User');

async function main() {
  try {
    await connectDB();

    const jobResult = await deleteExpiredJobs();
    const internshipResult = await deleteExpiredInternship();

    const otpResult = await User.updateMany(
      { otpExpiry: { $lt: new Date() } },
      { $set: { otp: null, otpExpiry: null } }
    );

    console.log(`Recruiter cleanup: deleted ${jobResult.deletedCount} expired jobs, ${internshipResult.deletedCount} expired internships, cleared ${otpResult.modifiedCount} expired OTP records.`);
  } catch (error) {
    console.error('Recruiter cleanup failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();
