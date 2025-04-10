// Import necessary modules
const SubSection = require("../model/SubSection");
const Section = require("../model/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const SubSection = require("../model/SubSection");

// Create a new sub-section for a given section
exports.createSubSection = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { sectionId, title, timeDuration, description } = req.body;
    const video = req.files.videoFile;

    // Check if all necessary fields are provided
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res
        .status(404)
        .json({ success: false, message: "All Fields are Required" });
    }

    // Upload the video file to Cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    // Create a new sub-section with the necessary information
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // Update the corresponding section with the newly created sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: SubSectionDetails._id } },
      { new: true }
    ).populate("subSection");

    // Return the updated section in the response
    return res.status(200).json({ success: true, data: updatedSection });
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error creating new sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//HW: updateSubSection
exports.updateSubSection = async(req, res) =>{
  try {
    const {title, description, sectionId} = req.body;
    const subSection = await SubSection.findById(sectionId);

    if(!subSection){
      return res.status(400).json({
        success:false,
        message:"subsection not found"
      })
    }

    if(title !==undefined){
      subSection.title = title;
    }

    if(description !== undefined){
      subSection.description = description;
    }

    const video = req.files.videoFile;
    if(video !== undefined){
      const uploadVideo = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );

      subSection.videoUrl = uploadVideo.secure_url;
      subSection.timeDuration =`${uploadVideo.durattion}`
    }

    await subSection.save()

    return res.status(200).json({
      success:true,
      message:"Section updated successfully"
    })


    } catch (error) {
      return res.status(500).json({
        success:false,
        message:error.message
      })
  }
}

//HW:deleteSubSection
exports.deleteSubSection=async(req, res) =>{
  try {
    const {sectionId, subSectionId} = req.body;
    const deleteSubSection = await SubSection.findByIdAndDelete({_id:subSectionId})
    const updateSection = await Section.findByIdAndUpdate({_id:sectionId}, {$pull:{
      subSection:subSectionId
    }})

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" })
    }

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
    })
  } catch (error) {
    console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
  }
}
