const express = require('express');
const { sendOtpController, verifyOtpController, sampleController } = require('../controllers/otpController');

const router = express.Router();

router.get('/users/send-otp/:mobileNumber', sendOtpController);
router.post('/users/verify-otp', verifyOtpController);

router.get('/hello', sampleController);

module.exports = router;