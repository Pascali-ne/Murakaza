const express = require("express");
const {
  uploadFile,
  getUploadedFile,
  listUploadedFiles,
  deleteUploadedFile,
} = require("../controllers/uploadController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Public route to view / stream uploaded images & videos
router.get("/:id", getUploadedFile);

// Admin routes to upload, list, and delete files
router.post("/", requireAuth, requireRole("ADMIN"), uploadFile);
router.get("/", requireAuth, requireRole("ADMIN"), listUploadedFiles);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteUploadedFile);

module.exports = router;
