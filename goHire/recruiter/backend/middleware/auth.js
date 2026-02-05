const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'recruiter-jwt-secret');
    const user = await User.findById(decoded._id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    req.user = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      profileImage: user.profileImage
    };
    req.userId = user._id;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }
};

module.exports = {
  requireAuth
};
