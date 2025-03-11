const User = require("../model/User");
const OTP = require("../model/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Send OTP Controller
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    // Generate a unique OTP
    let otp;
    do {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
    } while (await OTP.findOne({ otp }));

    // Store OTP in database
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    // Return success response
    res.status(200).json({
      success: true,
      message: "OTP sent successfully!",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Error while sending OTP",
    });
  }
};

//Sign Up Controller
exports.signUp = async (req, res) => {
  try {
    // Data Fetch from body
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

    // Data Check
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

    // Password Check
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password Don't Match",
      });
    }

    // User Check
    const existingUser = await User.findOne({ $or: [{ email }, { contactNumber }] });

    if (existingUser) {
      return res.status(403).json({
        success: false,
        message: "User Already Exists!",
      });
    }

    // Fetch recent OTP and validate
    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!recentOtp || recentOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP!",
      });
    }

    // Hash Password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (hashError) {
      return res.status(500).json({
        success: false,
        message: "Error hashing password",
      });
    }

    // Create Entry in DB
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

    // Return success message
    return res.status(200).json({
      success: true,
      message: "User Registered Successfully!",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "User Registration Failed! Try Again",
    });
  }
};

//Log In Controller
exports.logIn = async (req, res) => {
  try {
      // Fetching data from request body
      const { email, password } = req.body;

      // Validation: Check if email or password is missing
      if (!email || !password) {
          return res.status(400).json({
              success: false,
              message: "Please fill in all login details correctly!" 
          });
      }

      // Check if user exists
      const existingUser = await User.findOne({ email }); 
      if (!existingUser) {
          return res.status(404).json({ 
              success: false,
              message: "User is not registered!"
          });
      }

      // Validate password
      if (await bcrypt.compare(password, existingUser.password)) {
          // Create JWT payload
          const payload = {
              email: existingUser.email,
              id: existingUser._id, 
              accountType: existingUser.accountType,
          };

          // Generate JWT token
          const token = jwt.sign(
              payload,
              process.env.JWT_SECRET,
              { expiresIn: "2h" }
          );

          // Update user document (optional)
          existingUser.token = token;
          existingUser.password = undefined; 
          // await existingUser.save(); // Uncomment if you want to persist the token in the database

          // Set cookie options
          const options = {
              expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 
              httpOnly: true,
              secure: true, 
              sameSite: 'None' 
          };

          // Send response with cookie
          res.status(200)
              .cookie("token", token, options)
              .json({
                  success: true,
                  token,
                  user: { 
                      email: existingUser.email,
                      accountType: existingUser.accountType,
                      id: existingUser._id
                  },
                  message: "Logged in successfully!"
              });
      } else {
          return res.status(401).json({ 
              success: false,
              message: "Incorrect password!"
          });
      }

  } catch (error) {
      console.error("Login error:", error); 
      return res.status(500).json({
          success: false,
          message: "Login failed. Please try again later."
      });
  }
};

//Change Password
exports.changePassword = async (req, res) =>{
  try {

    //fetch Data and Validation
    const {email, oldPassword, newPassword, newConfirmPassword} = req.body;
    if(!email || !oldPassword || !newPassword || !newConfirmPassword ){
      return res.status(403).json({
        success:false,
        message:"Fill The Details Correctly"
      })
    }

    //User Fetch
    const user = await User.findOne({email})
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    //validation
    if(await bcrypt.compare(oldPassword, user.password)){
      return res.status(404).json({
        success:false,
        message:"Current Password is not matching"
      })
    }

    //Password Hasing and Save
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save()

     // Return success message
     return res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });

  } catch (error) {
    console.error("Error in changePassword:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Try again.",
    });
  }
};