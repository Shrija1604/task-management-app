const express = require("express");
const router = express.Router();
const {
  getAttachments,
  addAttachment,
  deleteAttachment,
} = require("../controllers/attachmentController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Routes related to a specific task
router.route("/task/:taskId")
  .get(protect, getAttachments)
  .post(protect, upload.single("file"), addAttachment);

// Routes for a specific attachment
router.route("/:id")
  .delete(protect, deleteAttachment);

module.exports = router;
