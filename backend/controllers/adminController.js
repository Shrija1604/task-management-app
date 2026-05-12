const User = require("../models/User");
const Task = require("../models/Task");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete an admin account" });
    }

    // Delete all tasks associated with the user first
    await Task.deleteMany({ user: user._id });
    await user.deleteOne();
    res.json({ message: "User removed" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const taskCount = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "Done" });

    // Get all users with their task counts
    const users = await User.find({}).select("-password");
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const userTasks = await Task.countDocuments({ user: user._id });
        const userCompleted = await Task.countDocuments({
          user: user._id,
          status: "Done",
        });
        return {
          ...user.toObject(),
          taskCount: userTasks,
          completionRate:
            userTasks > 0
              ? ((userCompleted / userTasks) * 100).toFixed(1)
              : 0,
        };
      })
    );

    res.json({
      totalUsers: userCount,
      totalTasks: taskCount,
      completionRate:
        taskCount > 0
          ? ((completedTasks / taskCount) * 100).toFixed(1)
          : 0,
      users: usersWithStats,
    });
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

// @desc    Get all system tasks
// @route   GET /api/admin/tasks
// @access  Private/Admin
const getSystemTasks = async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(tasks);
  } catch (error) {
    console.error("Get System Tasks Error:", error);
    res.status(500).json({ message: "Failed to fetch system tasks" });
  }
};

module.exports = { getUsers, deleteUser, getDashboardStats, getSystemTasks };
