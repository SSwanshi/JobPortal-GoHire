const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { upload } = require('../middleware/multer');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/logout', authController.logout);
router.get('/check-session', authController.checkSession);
router.get('/user/profile', authController.getProfile);
router.put('/user/profile', authController.updateProfile);
router.post('/user/profile-image', upload.single('image'), authController.uploadProfileImage);
router.get('/profile-image/:id', authController.getProfileImage);

// Forgot password routes
router.post('/forgot-password', authController.sendForgotPasswordOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/reset-password', authController.resetPassword);

// Change password route (requires authentication)
router.post('/change-password', authController.changePassword);

module.exports = router;
