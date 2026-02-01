const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Login
router.post('/login', authController.login);
router.post('/verify-2fa', authController.verify2FA);

// Logout
router.post('/logout', authController.logout);

// Get current user
router.get('/me', authController.getCurrentUser);

module.exports = router;

