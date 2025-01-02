const ApiDocs = require('../Models/apiDocs'); // Import ApiDocs model
const cloudinary = require('cloudinary').v2; // Import Cloudinary
const multer = require('multer'); // Import Multer
const path = require('path'); // Import Path
const fs = require("fs");

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

const upload = multer({
  storage,
  limits: {
    fieldNameSize: 100 * 1024 * 1024, // Field name size limit (100 MB)
    fieldSize: 100 * 1024 * 1024, // Max field value size (100 MB)
    fileSize: Infinity, // No file size limit
    files: Infinity, // No limit on the number of files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Invalid file type. Only images are allowed."));
  },
}).fields([
  { name: "bannerImage", maxCount: 1 },
  { name: "descriptionImage", maxCount: 1 },
]);

// API Doc Creation
const createApiDoc = async (req, res) => {
  try {
    const { title, short_desc, description = "Draft" } = req.body;

    let banner_image_url = null;
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
const getApiDocs = async (req, res) => {
  try {
    const apiDocs = await ApiDocs.findAll();
    res.status(200).json(apiDocs);
  } catch (error) {
    console.error("Error in getApiDocs:", error);
    res.status(500).json({ message: error.message });
  }
};

// Controller to get a single API document by api_id
const getApiDoc = async (req, res) => {
  try {
    const { id } = req.params;
    const apiDoc = await ApiDocs.findOne({
      where: { api_id: id }, // Use findOne with a where clause
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

const updateApiDoc = async (req, res) => {
  try {
    const { id } = req.params; // This will receive the api_id from the URL
    const { title, link, short_desc, description, status, category } = req.body;

    console.log("Received ID:", id);
    console.log("Received Data from Frontend:", title, link, short_desc, description);

    let banner_image_url = null;
    let description_image_url = null;

    // Find the API document by api_id, which is unique
    const api = await ApiDocs.findOne({ where: { api_id: id } });
  
    if (!api) {
      console.log("API NOT FOUND GIRI")
      return res.status(404).json({ error: "API not found" });
    }

    // Update banner image if provided
    if (req.files && req.files.bannerImage) {
      const result = await cloudinary.uploader.upload(req.files.bannerImage[0].path);
      banner_image_url = result.secure_url;
      // Optionally, delete the old image from Cloudinary
      if (api.bannerImage) {
        const publicId = api.bannerImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      fs.unlinkSync(req.files.bannerImage[0].path);
    } else {
      banner_image_url = api.bannerImage; // Keep the old image if not uploaded
    }

    // Update description image if provided
    if (req.files && req.files.descriptionImage) {
      const result = await cloudinary.uploader.upload(req.files.descriptionImage[0].path);
      description_image_url = result.secure_url;
      // Optionally, delete the old image from Cloudinary
      if (api.descriptionImage) {
        const publicId = api.descriptionImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      fs.unlinkSync(req.files.descriptionImage[0].path);
    } else {
      description_image_url = api.descriptionImage; // Keep the old image if not uploaded
    }

   
    console.log('FiNdED API = ',api)
    // Update the API document
    await api.update({
      title,
      link,
      short_desc,
      description,
      bannerImage: banner_image_url,
      descriptionImage: description_image_url,
      status,
      link,
    });
    console.log("ApI UpDated Successfully")
    res.status(200).json({ message: "API updated successfully", api });
  } catch (error) {
    console.error("Error updating API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Controller to delete an API document
const deleteApiDoc = async (req, res) => {
  try {
    const { id } = req.params; // Ensure to extract id from request params

    // Find and delete the ApiDocs record
    const deleted = await ApiDocs.destroy({
      where: { api_id: id }, // Use destroy method with a where clause
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

module.exports = { createApiDoc, upload, getApiDoc, getApiDocs, updateApiDoc, deleteApiDoc };
