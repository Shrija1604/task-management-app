const FocusSession = require("../models/FocusSession");
const Task = require("../models/Task");

// @desc    Get focus sessions for a specific task
// @route   GET /api/focussessions/task/:taskId
// @access  Private
const getFocusSessions = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const sessions = await FocusSession.find({ task: taskId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Add a focus session to a task
// @route   POST /api/focussessions/task/:taskId
// @access  Private
const addFocusSession = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { duration, startTime, completed } = req.body;

    if (!duration) {
      return res.status(400).json({ success: false, message: "Please provide duration" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const session = await FocusSession.create({
      duration,
      startTime: startTime || Date.now(),
      completed: completed || false,
      task: taskId,
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Update a focus session (e.g. mark completed)
// @route   PUT /api/focussessions/:id
// @access  Private
const updateFocusSession = async (req, res) => {
  try {
    const session = await FocusSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: "Focus Session not found" });
    }

    const task = await Task.findById(session.task);
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const updatedSession = await FocusSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedSession });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Delete a focus session
// @route   DELETE /api/focussessions/:id
// @access  Private
const deleteFocusSession = async (req, res) => {
  try {
    const session = await FocusSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: "Focus Session not found" });
    }

    const task = await Task.findById(session.task);
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    await session.deleteOne();
    res.status(200).json({ success: true, message: "Focus Session deleted", data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = { getFocusSessions, addFocusSession, updateFocusSession, deleteFocusSession };
