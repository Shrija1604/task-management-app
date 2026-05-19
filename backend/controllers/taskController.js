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
      dueTime,
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
      dueTime,
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
    const { search, status, priority, category, sortBy, sortOrder, startDate, endDate } = req.query;
    
    // Build the query object
    let query = { user: req.user._id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    
    if (startDate || endDate) {
      query.dueDate = {};
      if (startDate) query.dueDate.$gte = new Date(startDate);
      if (endDate) query.dueDate.$lte = new Date(endDate);
    }

    // Build the sort object
    let sortObj = { createdAt: -1 };
    if (sortBy) {
      sortObj = {};
      sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    const tasks = await Task.find(query).sort(sortObj);

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

    // Overdue tasks
    const now = new Date();
    const overdue = await Task.countDocuments({
      user: userId,
      status: { $ne: "Done" },
      dueDate: { $lt: now }
    });

    // Upcoming tasks — due within the next 7 days and not done
    const oneWeekLater = new Date();
    oneWeekLater.setDate(now.getDate() + 7);

    const upcoming = await Task.find({
      user: userId,
      status: { $ne: "Done" },
      dueDate: { $gte: now, $lte: oneWeekLater },
    })
      .sort({ dueDate: 1 })
      .limit(5);
      
    // Weekly productivity (tasks completed per day for last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    
    const completedLastWeek = await Task.aggregate([
      {
        $match: {
          user: userId,
          status: "Done",
          updatedAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format weekly data for Recharts
    const weeklyData = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dateString = d.toISOString().split('T')[0];
      const found = completedLastWeek.find(x => x._id === dateString);
      weeklyData.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: found ? found.count : 0
      });
    }

    res.status(200).json({
      total,
      completed,
      inProgress,
      pending,
      overdue,
      categories,
      upcoming,
      weeklyData
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