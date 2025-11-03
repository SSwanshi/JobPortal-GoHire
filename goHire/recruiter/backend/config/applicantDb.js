const mongoose = require('mongoose');
require('dotenv').config();

let applicantConnection = null;

const connectApplicantDB = async () => {
  try {
    if (!process.env.MONGO_URI_APPLICANT) {
      console.warn('⚠️ MONGO_URI_APPLICANT not set. Using default connection.');
      return null;
    }

    if (applicantConnection && applicantConnection.readyState === 1) {
      return applicantConnection;
    }

    applicantConnection = await mongoose.createConnection(process.env.MONGO_URI_APPLICANT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ Applicant MongoDB Connected: ${applicantConnection.host}`);
    return applicantConnection;
  } catch (error) {
    console.error('❌ Applicant MongoDB Connection Failed', error);
    return null;
  }
};

const getApplicantConnection = () => {
  return applicantConnection;
};

module.exports = { connectApplicantDB, getApplicantConnection };

