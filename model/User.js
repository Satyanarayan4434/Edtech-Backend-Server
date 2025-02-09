const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true, 
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    contactNumber:{
        type:Number,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    accountType:{
        type:String,
        enum:["Admin", "Student", "Instructor"],
        required:true,
    },
    active:{
        type:Boolean,
        default:false,
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Courses",
    }],
    profile:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
    },
    courseProgress:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"courseProgress",
    },
    image:{
        type:String
    },
    token:{
        type:String
    },
    resetPasswordExpires:{
        type:Date
    }
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);