const User = require("../models/User");
const Task = require("../models/Task");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete an admin account" });
    }

    await Task.deleteMany({ user: user._id });
    await user.deleteOne();
    res.json({ message: "User removed" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const taskCount = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "Done" });
    const inProgressTasks = await Task.countDocuments({ status: "In Progress" });
    const pendingTasks = await Task.countDocuments({ status: "Pending" });

    const highPriority = await Task.countDocuments({ priority: "High" });
    const mediumPriority = await Task.countDocuments({ priority: "Medium" });
    const lowPriority = await Task.countDocuments({ priority: "Low" });

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
      breakdown: {
        status: { completed: completedTasks, inProgress: inProgressTasks, pending: pendingTasks },
        priority: { High: highPriority, Medium: mediumPriority, Low: lowPriority }
      }
    });
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

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

const deleteSystemTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.deleteOne();
    res.json({ message: "Task deleted by administrator" });
  } catch (error) {
    console.error("Delete System Task Error:", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
};

module.exports = { getUsers, deleteUser, getDashboardStats, getSystemTasks, deleteSystemTask };