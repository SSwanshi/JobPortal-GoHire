const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/db');

async function main() {
  try {
    const conn = await connectDB();
    const Job = require('../models/Job')(conn);
    const Internship = require('../models/Internship')(conn);

    const [jobResult, internshipResult] = await Promise.all([
      Job.deleteMany({ jobExpiry: { $lt: new Date() } }),
      Internship.deleteMany({ intExpiry: { $lt: new Date() } }),
    ]);

    console.log(`Admin cleanup: deleted ${jobResult.deletedCount} expired jobs, ${internshipResult.deletedCount} expired internships.`);
  } catch (error) {
    console.error('Admin cleanup failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();
