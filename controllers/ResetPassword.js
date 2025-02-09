const User = require("../model/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//ResetPassword
exports.resetPasswordLink = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Fill the details correctly",
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    const token = crypto.randomUUID();
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );

    const url = `http://localhost:3000/update-password/${token}`;

    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link ${url}`
    );

    return res.status(200).json({
      success: true,
      message: "Password Reset Link Successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong! Try Again",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    //Data Fetch
    const { password, confirmPassword, token } = req.body;
    if (!password || !confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Fill The Details Correctly",
      });
    }

    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Password not matching",
      });
    }

    //Token Fetching And Validation
    const userDetails = await User.findOne({ token: token });
    if (!userDetails) {
      return res.status(401).json({
        success: false,
        message: "Token Is Invalid",
      });
    }
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "Token Is Expired",
      });
    }

    //Password Hash
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Password Reset Successfull",
    });
  } catch (error) {
    console.log("Password Reset Error-->", error)
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};
