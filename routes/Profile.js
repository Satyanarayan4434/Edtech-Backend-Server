const express = require("express");
const router = express.Router();

// Import controller function required
const {
  updateProfile,
  deleteAccount,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
} = require("../controllers/Profile");

const {auth} = require("../middlewares/auth");

//***************************************************************************** *//
//                                  Profile Routes                              *//
//***************************************************************************** *//
router.put("/updateProfile", auth, updateProfile);
router.delete("/deleteAccount", auth, deleteAccount);
router.get("/getUserDetails", auth, getAllUserDetails);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);

//Exporting the router for use in main application
module.exports = router;