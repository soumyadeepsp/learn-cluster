const express = require('express');
const { sendOtpController, verifyOtpController } = require('../controllers/otpController');

const router = express.Router();

router.get('/users/send-otp/:mobileNumber', sendOtpController);
router.post('/users/verify-otp', verifyOtpController);

router.get('/hello', (req, res) => {
    res.send('Hello, World!');
});

module.exports = router;