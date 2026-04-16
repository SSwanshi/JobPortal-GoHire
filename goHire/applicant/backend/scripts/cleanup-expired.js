const mongoose = require('mongoose');
require('dotenv').config();
const { connectDB } = require('../config/db');
const User = require('../models/user');

async function main() {
  try {
    await connectDB();

    const otpResult = await User.updateMany(
      { otpExpiry: { $lt: new Date() } },
      { $set: { otp: null, otpExpiry: null } }
    );

    console.log(`Applicant cleanup: cleared ${otpResult.modifiedCount} expired OTP records.`);
  } catch (error) {
    console.error('Applicant cleanup failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();
