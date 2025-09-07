// create a schema for storing otp with monile number and otp fields and delete it automatically within 30 seconds using a post hook

const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: 30 } // expires after 30 seconds
    }
});

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;