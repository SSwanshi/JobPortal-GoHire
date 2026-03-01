const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const upgradeController = require('../controllers/upgrade.controller');

router.post('/create-checkout-session', requireAuth, upgradeController.createCheckoutSession);

module.exports = router;
