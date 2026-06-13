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

router.get("/stats", protect, getTaskStats);

router
  .route("/")
  .post(protect, createTask)
  .get(protect, getTasks);

router
  .route("/:id")
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;