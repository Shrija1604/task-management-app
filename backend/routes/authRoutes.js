const express = require("express");
const {
  registerUser,
  loginUser,
  updateUserPreferences,
  updateProfile,
  forgotPassword,
  resetPassword,
  deleteAccount,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.put("/preferences", protect, updateUserPreferences);
router.put("/profile", protect, updateProfile);
router.delete("/account", protect, deleteAccount);

module.exports = router;