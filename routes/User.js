const express = require("express");
const router = express.Router()

// Import required controller and middlewire functions
const {signup, login, sendotp, changePassword} = require("../controllers/Auth");
const {auth} = require("../middlewares/auth");
const {resetPasswordToken, resetPassword} = require("../controllers/ResetPassword");

//************************************************************************ *//
//                Routes for login, SignUp, Authentication                  //
//************************************************************************ *//
router.post("/login", login);
router.post("/signup", signup);
router.post("/sendotp", sendotp);
router.post("/changepassword", auth, changePassword);


//************************************************************************ *//
//                Routes for password reset functions                  //
//************************************************************************ *//
router.post("/resetpasswordtoken", resetPasswordToken);
router.post("/resetpassword", resetPassword);


//Exporting the router for use in main application
module.exports = router


