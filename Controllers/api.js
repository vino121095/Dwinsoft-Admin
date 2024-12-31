const ApiDocs = require('../Models/apiDocs'); // Import ApiDocs model
const cloudinary = require('cloudinary').v2; // Import Cloudinary
const multer = require('multer'); // Import Multer
const path = require('path'); // Import Path

// Cloudinary Configuration
cloudinary.config({
  cloud_name: "ddapwn5l5", // Replace with your Cloudinary cloud name
  api_key: "955737422864725", // Replace with your Cloudinary API key
  api_secret: "MHAhDfKWk2vH4raKrvKnVABm3ZA", // Replace with your Cloudinary API secret
});

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

exports.upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed."));
    }
  },
});

exports.createApiDoc = async (req, res) => {
  try {
    const { title, short_desc, description = "Draft" } = req.body;

    let banner_image_url = null;
   // let description_image_url = null;
    let link = req.body.link || null; // Keep link as null if not provided

    // Upload banner image if provided
    if (req.files && req.files.bannerImage && req.files.bannerImage[0]) {
      const bannerImageResult = await cloudinary.uploader.upload(req.files.bannerImage[0].path);
      banner_image_url = bannerImageResult.secure_url;
      console.log("Banner Image URL:", banner_image_url);
    }

   
    console.log(title, short_desc, description, banner_image_url, link);

    // Create new API doc entry
    const apiDoc = await ApiDocs.create({
      title,
      short_desc,
      description,
      bannerImage: banner_image_url || null, // Store URL or null
      link // Store null if no link is provided
    });

    // Log created API doc
    console.log("Created API Doc:", apiDoc);

    // Respond with the created API doc
    res.status(201).json(apiDoc);
  } catch (error) {
    console.error("Error in createApiDoc:", error);
    res.status(500).json({ message: error.message });
  }
};



// Controller to get all API documents
exports.getApiDocs = async (req, res) => {
  try {
    const apiDocs = await ApiDocs.findAll();
    res.status(200).json(apiDocs);
  } catch (error) {
    console.error("Error in getApiDocs:", error);
    res.status(500).json({ message: error.message });
  }
};

// Controller to get a single API document by api_id
exports.getApiDoc = async (req, res) => {
  try {
    const apiDoc = await ApiDocs.findOne({
      where: { api_id: req.params.api_id }, // Use findOne with a where clause
    });
    
    if (apiDoc) {
      res.status(200).json(apiDoc);
    } else {
      res.status(404).json({ message: "ApiDoc not found" });
    }
  } catch (error) {
    console.error("Error in getApiDoc:", error);
    res.status(500).json({ message: error.message });
  }
};


// Controller to update an API document
exports.updateApiDoc = async (req, res) => {
  try {
    const { title, link, short_desc, description } = req.body;

    // Upload new images to Cloudinary if provided
    let bannerImage;
   

    if (req.files && req.files.bannerImage) {
      const bannerImageResult = await cloudinary.uploader.upload(req.files.bannerImage[0].path);
      console.log("Updated Banner Image URL:", bannerImageResult.secure_url);
      bannerImage = bannerImageResult.secure_url;
    }

   

    const updatedFields = {
      title,
      link,
      short_desc,
      description,
      ...(bannerImage && { bannerImage }),
      
    };

    const [updated] = await ApiDocs.update(updatedFields, {
      where: { api_id: req.params.api_id },
    });

    if (updated) {
      const updatedApiDoc = await ApiDocs.findOne({
        where: { api_id: req.params.api_id }, // Use findOne with a where clause
      });
      res.status(200).json(updatedApiDoc);
    } else {
      res.status(404).json({ message: "ApiDoc not found" });
    }
  } catch (error) {
    console.error("Error in updateApiDoc:", error);
    res.status(500).json({ message: error.message });
  }
};

// Controller to delete an API document
exports.deleteApiDoc = async (req, res) => {
  try {
    // Find and delete the ApiDocs record
    const deleted = await ApiDocs.destroy({
      where: { api_id: req.params.api_id }, // Use destroy method with a where clause
    });

    if (deleted) {
      res.status(204).json(); // Successfully deleted
    } else {
      res.status(404).json({ message: "ApiDoc not found" });
    }
  } catch (error) {
    console.error("Error in deleteApiDoc:", error);
    res.status(500).json({ message: error.message });
  }
};
