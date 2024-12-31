// Routes/api.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const apiDocsController = require("../Controllers/api");

// Multer Configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post(
  "/docs",
  upload.fields([{ name: "bannerImage", maxCount: 1 }, { name: "descriptionImage", maxCount: 1 }]),
  apiDocsController.createApiDoc
);

router.get("/docs", apiDocsController.getApiDocs);
router.get("/docs/:api_id", apiDocsController.getApiDoc);
router.put(
  "/docs/:api_id",
  upload.fields([{ name: "bannerImage", maxCount: 1 }, { name: "descriptionImage", maxCount: 1 }]),
  apiDocsController.updateApiDoc
);
router.delete("/docs/:api_id", apiDocsController.deleteApiDoc);

module.exports = router;
