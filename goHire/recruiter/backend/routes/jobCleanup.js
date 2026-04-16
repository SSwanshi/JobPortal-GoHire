const Job = require('../models/Jobs');

async function deleteExpiredJobs() {
  try {
    const result = await Job.deleteMany({
      jobExpiry: { $lt: new Date() }
    });
    console.log(`Deleted ${result.deletedCount} expired jobs`);
    return result;
  } catch (error) {
    console.error('Error deleting expired jobs:', error);
    return { deletedCount: 0 };
  }
}

module.exports = deleteExpiredJobs;

