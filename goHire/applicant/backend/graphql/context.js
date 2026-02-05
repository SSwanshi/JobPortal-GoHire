const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');

/**
 * Extract and verify JWT token from request headers
 * Returns the decoded user object or null
 */
const getUserFromToken = (req) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization || '';
    
    if (!authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return null;
    }

    // Verify and decode token
    const decoded = jwt.verify(token, jwtSecret);
    
    return decoded;
  } catch (error) {
    // Token is invalid or expired
    console.error('Token verification error:', error.message);
    return null;
  }
};

module.exports = { getUserFromToken };
