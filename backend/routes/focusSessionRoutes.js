const express = require("express");
const router = express.Router();
const {
  getFocusSessions,
  addFocusSession,
  updateFocusSession,
  deleteFocusSession,
} = require("../controllers/focusSessionController");

const { protect } = require("../middleware/authMiddleware");

// Routes related to a specific task
router.route("/task/:taskId")
  .get(protect, getFocusSessions)
  .post(protect, addFocusSession);

// Routes for a specific focus session
router.route("/:id")
  .put(protect, updateFocusSession)
  .delete(protect, deleteFocusSession);

module.exports = router;
