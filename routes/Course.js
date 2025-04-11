const express = require("express");
const router = express.Router()

//Importing the controller
const {createCourse, getAllCourses, getCourseDetails} = require("../controllers/Course");
const {createCategory, showAllCategories, categoryPageDetails} = require("../controllers/Category");
const {createRating, getAverageRating, getAllRating} = require("../controllers/RatingAndReview");
const {createSection, updateSection, deleteSection} = require("../controllers/Section");
const {createSubSection, updateSubSection, deleteSubSection} = require("../controllers/SubSection");

//Importing Middlewire constroller for auth//
const {auth, isInstructor, isAdmin, isStudent} = require("../middlewares/auth");

//************************************************************************************** *//
//                                  Define Routes For Course                             //
//************************************************************************************* //
router.post("/createCourse", auth, isInstructor, createCourse);
router.get("/getAllPost", getAllCourses);
router.get("/getCourseDetails", getCourseDetails);

//************************************************************************************** *//
//                                  Define Routes For Category                           //
//************************************************************************************* //
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories);
router.get("/getCategoryPageDetails", categoryPageDetails);

//************************************************************************************** *//
//                                  Define Routes For Rating And Review                  //
//************************************************************************************* //
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getAllReviews", getAllRating);

//************************************************************************************** *//
//                                  Define Routes For Section                            //
//************************************************************************************* //
router.post("/addSection", auth, isInstructor, createSection);
router.put("/updateSection", auth, isInstructor, updateSection);
router.delete("/deleteSection", auth, isInstructor, deleteSection);

//************************************************************************************** *//
//                                  Define Routes For Sub-ion                            //
//************************************************************************************* //
router.post("/addSubSection", auth, isInstructor, createSubSection);
router.put("/updateSubSection", auth, isInstructor, updateSubSection);
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection);

module.exports = router

