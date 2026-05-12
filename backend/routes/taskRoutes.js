const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskStats,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");

// STATS ROUTE — must be before /:id to avoid conflict
router.get("/stats", protect, getTaskStats);

// CREATE TASK + GET TASKS
router
  .route("/")
  .post(protect, createTask)
  .get(protect, getTasks);

// UPDATE TASK + DELETE TASK
router
  .route("/:id")
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;