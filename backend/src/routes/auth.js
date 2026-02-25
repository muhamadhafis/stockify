const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const catchAsync = require('../utils/catchAsync');

router.post('/register', catchAsync(authController.register));
router.post('/send-otp', catchAsync(authController.sendOtp));
router.post('/verify-otp', catchAsync(authController.verifyOtp));
router.post('/login', catchAsync(authController.login));

module.exports = router;
