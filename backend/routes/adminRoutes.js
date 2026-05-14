const express = require("express");
const router = express.Router();
const { 
  getUsers, 
  deleteUser, 
  getDashboardStats,
  getSystemTasks,
  deleteSystemTask 
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.route("/users").get(protect, admin, getUsers);
router.route("/users/:id").delete(protect, admin, deleteUser);
router.route("/stats").get(protect, admin, getDashboardStats);
router.route("/tasks").get(protect, admin, getSystemTasks);
router.route("/tasks/:id").delete(protect, admin, deleteSystemTask);

module.exports = router;
