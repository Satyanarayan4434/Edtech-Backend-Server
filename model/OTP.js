const mongoose = require("mongoose");
import mailSender from '../utils/mailSender'

const otpSchema = new mongoose.Schema({
    email:{
        type: String,
    },
    otp:{
        type: String,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 5*60,
    }
})

async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(email, "Verification Mail From EdTech", otp);
        console.log("Email Sent Successfully", mailResponse)       
    } catch (error) {
        console.log("Error in Sending OTP -->", error)
    }    
}

otpSchema.pre('save', async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
} )

module.exports = mongoose.model("OTP", otpSchema);