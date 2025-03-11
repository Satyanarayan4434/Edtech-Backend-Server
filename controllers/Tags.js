const Tag = require("../model/Tags");

//Tags Creation
exports.Tags = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(401).json({
        success: false,
        message: "All Fields Required",
      });
    }

    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });

    console.log(tagDetails);

    return res.status(200).json({
      success: true,
      message: "Tags Saved Successfully",
    });
  } catch (error) {
    console.log("Error In tags creation-->", error);
    return res.status(500).json({
      success: false,
      message: "Error Creating Tags",
    });
  }
};

//Get All Tags
exports.getAllTags = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: true, description: true });
    return res.status(200).json({
      success: true,
      message: "All Tags Find successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "Error when finding tags",
      });
  }
};


