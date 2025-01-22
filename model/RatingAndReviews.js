const mongoose = require("mongoose");

const ratingAndReviewsSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    rating:{
        type:Number,
    },
    review:{
        type:String,
    }
})

module.exports = mongoose.model("RatingAndReviews", ratingAndReviewsSchema);