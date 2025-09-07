// write a function to generate a 4 digit OTP
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
}

module.exports = { generateOTP };