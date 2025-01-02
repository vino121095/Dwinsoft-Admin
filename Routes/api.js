// Routes/api.js
const express = require("express");
const { createApiDoc, upload, getApiDocs, getApiDoc, updateApiDoc, deleteApiDoc } = require("../Controllers/api");

const router = express.Router();

router.post("/docs", upload, createApiDoc);  // Make sure `upload` is passed as middleware
router.get("/docs", getApiDocs);
router.get("/docs/:id", getApiDoc);
router.put("/docs/:id", upload, updateApiDoc);
router.delete("/docs/:id", deleteApiDoc);

module.exports = router;
