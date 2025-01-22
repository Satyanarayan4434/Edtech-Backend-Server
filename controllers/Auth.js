const User = require("../model/User");
const OTP = require("../model/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");

//Send OTP Controller
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        succuss: false,
        meassage: "User already Exit",
      });
    }

    //otp generate
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let checkOtp = await OTP.findOne({ otp });
    if (checkOtp) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
    }

    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
      success: true,
      meassage: "OTP sent successfully!",
    });
  } catch (error) {
    console.log(error.meassage);
    res.status(500).json({
      success: false,
      meassage: "Error While Sending OTP",
    });
  }
};

//Sign Up Controller
exports.signUp = async (req, res) => {
  try {
    //Data Fetch from body
    const {
      firstName,
      lastName,
      email,
      contactNumber,
      password,
      confirmPassword,
      accountType,
      active,
      image,
      otp,
    } = req.body;

    //Data Check
    if (
      !firstName ||
      !lastName ||
      !email ||
      !contactNumber ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "Fill All Details Carefully!",
      });
    }

    //Password Check
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password Does'nt Match",
      });
    }

    //User Check
    const exitUser = await User.findOne({ email, contactNumber });

    if (exitUser) {
      return res.status(403).json({
        success: false,
        message: "User Already Exit!",
      });
    }

    //fetch recent otp and validate
    const recentOtp = await OTP.find({ email }).sort(
      { createdAt: -1 }.limit(1)
    );
    console.log(recentOtp);

    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found!",
      });
    } else if (recentOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP!",
      });
    }

    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create Entry in DB
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      active,
      image: `https://api.dicebear.com/6.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    //Return success meassage
    return res.status(200).json({
        success:true,
        meassage:"User Registerd Successfful!"
    })

  } catch (error) {
    
    console.log(error.meassage)
    return res.status(500).json({
        success:false,
        meassage:"User Registration Failed! Try Again"
    })
  }
};

//Log In Controller
exports.logIn = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}
