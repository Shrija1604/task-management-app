const Task = require("../models/Task");

// CREATE TASK
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      category,
      dueDate,
    } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      status,
      priority,
      category,
      dueDate,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({
      message: "Failed to create task",
    });
  }
};

// GET TASKS
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Get Tasks Error:", error);
    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
};

// GET TASK STATS (for user dashboard)
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const total = await Task.countDocuments({ user: userId });
    const completed = await Task.countDocuments({ user: userId, status: "Done" });
    const inProgress = await Task.countDocuments({ user: userId, status: "In Progress" });
    const pending = await Task.countDocuments({ user: userId, status: "To Do" });

    // Count distinct categories
    const categoryAgg = await Task.distinct("category", { user: userId });
    const categories = categoryAgg.length;

    // Upcoming tasks — due within the next 7 days and not done
    const now = new Date();
    const oneWeekLater = new Date();
    oneWeekLater.setDate(now.getDate() + 7);

    const upcoming = await Task.find({
      user: userId,
      status: { $ne: "Done" },
      dueDate: { $gte: now, $lte: oneWeekLater },
    })
      .sort({ dueDate: 1 })
      .limit(5);

    res.status(200).json({
      total,
      completed,
      inProgress,
      pending,
      categories,
      upcoming,
    });
  } catch (error) {
    console.error("Get Task Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch task stats" });
  }
};

// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({
      message: "Failed to update task",
    });
  }
};

// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({
      message: "Failed to delete task",
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskStats,
  updateTask,
  deleteTask,
};