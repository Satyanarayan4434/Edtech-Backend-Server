const Course = require("../model/Courses");
const Tags = require("../model/Tags");
const User = require("../model/User");
const { UploadImage } = require("../utils/imageUploader");

exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;
    const thumbnail = req.files.thumbnail;

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required",
      });
    }

    const userId = req.user.id;
    const instructorDetails = await User.findById({ userId });

    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "Instrucor not found",
      });
    }

    const tagDetails = await Tags.findById({ tag });
    if (!tagDetails) {
      return res.status(400).json({
        success: false,
        message: "Tag Details Not Found",
      });
    }

    const thumbnailImage = await UploadImage(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //Save DB
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails,
      whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );
    await Tags.findByIdAndUpdate(
      { _id: tagDetails._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course Created Successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log("Error When Course Is Creating-->", error);
    return res.status(500).json({
      success: false,
      message: "Error While Creating Course",
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviwes: true,
        studentEnrolled: true,
      }
    ).populate("instructor").exec();

    return res.status(200).json({
        success: true,
        message: "All Courses",
      });

  } catch (error) {
    console.log("Error When Fetching All Courses-->", error);
    return res.status(500).json({
      success: false,
      message: "Error When Fetching All Courses",
    });
  }
};
