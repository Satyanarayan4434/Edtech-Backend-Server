const mongoose = require("mongoose");
const { countDocuments } = require("./Tags");

const invoiceSchema = new mongoose.Schema({
    users:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    courseName:{
        type:String
    },
    price:{
        type:Number
    },
    address:{
        type:String
    },
    pincode:{
        type:String
    },
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Courses"
    }
})

module.exports = mongoose.model("Invoice", invoiceSchema);