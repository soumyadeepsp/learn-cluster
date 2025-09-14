const { generateOTP } = require('../utilities/helper');
const Otp = require('../models/otp');
const FAST2SMS_API = "sXkzhZWvA6gUIp5rOkaOU5NqZOifbjS1i3fUpwMC5Pn4D7HGGwF5QiGkwS2H";
var unirest = require("unirest");
const client = require('../config/redis');

module.exports.sendOtpController = async (req, res) => {
    try {
        const otp = generateOTP();
        const mobileNumber = req.params.mobileNumber;
        console.log(otp);
        var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");
        req.query({
            "authorization": FAST2SMS_API,
            "message": `Your OTP is ${otp}`,
            "language": "english",
            "route": "q",
            "numbers": mobileNumber,
        });
        req.headers({
            "cache-control": "no-cache"
        });
        
        req.end(async function (res) {
            if (res.error) {
                console.log(res.error);
                return res.status(500).json({
                    message: 'Error in sending OTP'
                });
            }
            console.log(res.body);
            // save the otp to the database
            const newOtp = await new Otp({
                mobile: mobileNumber,
                otp,
                createdAt: new Date(),
                expiresAt: new Date(new Date().getTime() + 5 * 60000) // expires in 5 minutes
            });
            await newOtp.save();
        });
        // {
        //     return: true,
        //     request_id: 'xMtoHLgN2CpEDwU',
        //     message: [ 'SMS sent successfully.' ]
        // }
        return res.status(200).json({
            message: 'OTP sent successfully'
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

module.exports.verifyOtpController = async (req, res) => {
    try {
        const { mobile, otp } = req.body;
        const record = await Otp.findOne({ mobile, otp }).sort({ createdAt: -1 }); // fetching the latest data
        if (!record) {
            return res.status(400).json({
                message: 'Invalid OTP or OTP has expired'
            });
        }
        // store the mobile number in the user DB
        await Otp.deleteMany({ mobile }); // delete all the OTPs for that mobile number
        return res.status(200).json({
            message: 'OTP verified successfully'
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

module.exports.sampleController = async (req, res) => {
    try {
        const message = await client.get('mykey');
        return res.status(200).json({
            message: message
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}