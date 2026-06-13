const express = require("express");
const router = express.Router();
const {
  getNotes,
  createNote,
  deleteNote,
} = require("../controllers/noteController");

const { protect } = require("../middleware/authMiddleware");

// Routes related to a specific task
router.route("/task/:taskId")
  .get(protect, getNotes)
  .post(protect, createNote);

// Routes for a specific note
router.route("/:id")
  .delete(protect, deleteNote);

module.exports = router;
