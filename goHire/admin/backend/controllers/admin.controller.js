const mongoose = require('mongoose');
const connectApplicantDB = require('../config/applicantDB');
const { initGridFS } = require('../db/gridfs');

function createPremiumUserModel(connection) {
  if (connection.models.Premium_User) {
    return connection.models.Premium_User; // reuse existing model
  }
  const premiumUserSchema = new mongoose.Schema({
    userId: {
      type: String,
      unique: true,
      default: () => Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15)
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other']
    },
    password: {
      type: String,
      required: true
    },
    memberSince: {
      type: Date,
      default: Date.now
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'uploads.files'
    }
  }, { timestamps: true });

  return connection.model("Premium_User", premiumUserSchema);
}

const getPremiumUsers = async (req, res) => {
  try {
    const applicantConn = await connectApplicantDB();
    const PremiumUserModel = createPremiumUserModel(applicantConn);
    
    const premiumUsers = await PremiumUserModel.find({})
      .select('email firstName lastName memberSince')
      .sort({ email: 1 })
      .lean();
    
    const formattedUsers = premiumUsers.map(user => ({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      memberSince: user.memberSince,
      status: 'Premium'
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching premium users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProofDocument = async (req, res) => {
  try {
    const { proofId } = req.params;
    const { gfs } = await initGridFS();
    
    if (!gfs) {
      return res.status(500).json({ error: "GridFS is not initialized" });
    }

    const fileId = new mongoose.Types.ObjectId(proofId);
    
    const fileData = await gfs.find({ _id: fileId }).toArray();

    if (!fileData || fileData.length === 0) {
      return res.status(404).json({ error: "Proof document not found" });
    }

    const file = fileData[0];
    const readStream = gfs.openDownloadStream(file._id);

    res.set('Content-Type', file.contentType);
    res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
    readStream.pipe(res);
  } catch (error) {
    console.error("Error downloading proof document:", error);
    res.status(500).json({ error: "Failed to download document" });
  }
};

module.exports = {
  getPremiumUsers,
  getProofDocument
};

