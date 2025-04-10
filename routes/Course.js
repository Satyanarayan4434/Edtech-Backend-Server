const express = require("express");
const router = express.Router()

//Importing the controller
const {createCourse, getAllCourses, getCourseDetails} = require("../controllers/Course");
const {createCategory, showAllCategories, categoryPageDetails} = require("../controllers/Category");
const {createRatingAndReview, getAverageRating, getAllRating} = require("../controllers/RatingAndReview");
const {createSection, updateSection, deleteSection} = require("../controllers/Section");
const {createSection, updateSection, deleteSection} = require("../controllers/Section");