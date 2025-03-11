const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../model/User");

//auth
exports.auth = async(req, res, next) =>{
    try {
        const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is Missing"
            })
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode)
            req.user = decode;
        } catch (error) {
            return res.status(403).json({
                success:false,
                message:"Token is Invalid"
            })
        }
        next()


    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Token is Missing"
        })
    }
}

//isStudent
exports.isStudent = async(req, res, next) =>{
    try {
         if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for student only"
            })
         }   
         next()
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"User Role Can not be verified"
        })
    }
}

//isStudent
exports.isInstructor = async(req, res, next) =>{
    try {
         if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor only"
            })
         }   
         next()
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"User Role Can not be verified"
        })
    }
}

//isStudent
exports.isAdmin = async(req, res, next) =>{
    try {
         if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin only"
            })
         }   
         next()
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"User Role Can not be verified"
        })
    }
}