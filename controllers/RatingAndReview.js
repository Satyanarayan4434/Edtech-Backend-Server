const RatingAndReview = require("../model/RatingAndReview");
const Course = require("../model/Course");
const { default: mongoose } = require("mongoose");

exports.createRatingAndReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, review, courseId } = req.body;
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "You're not enrolled in this course",
      });
    }

    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res.status(404).json({
        success: false,
        message: "You're not eligle to review in this course",
      });
    }

    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    await Course.findByIdAndUpdate(
      { _id: courseId },
      { $push: { ratingAndReviews: ratingReview } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Your Rating And Review Submitted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Your Rating And Review Not submitted yet! Try Again",
    });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const courseId = req.body.courseId;

    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    return res.status(200).json({
      success: true,
      message: "No ratings yet",
      averageRating: 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllRating = async (req, res) => {
  try {
    const ratingAndReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName LastName email image",
      })
      .populate({ path: "course", select: "courseName" })
      .exec();

    return res.status(200).json({
      success: true,
      message: "All Rating and Reviews Fetched",
      data: ratingAndReviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching Rating and Reviews",
    });
  }
};
