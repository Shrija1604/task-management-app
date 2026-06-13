const Attachment = require("../models/Attachment");
const Task = require("../models/Task");

// @desc    Get attachments for a specific task
// @route   GET /api/attachments/task/:taskId
// @access  Private
const getAttachments = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const attachments = await Attachment.find({ task: taskId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: attachments.length, data: attachments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Add an attachment to a task
// @route   POST /api/attachments/task/:taskId
// @access  Private
const addAttachment = async (req, res) => {
  try {
    const { taskId } = req.params;
    let { fileName, fileUrl } = req.body;
    let fileSize = req.body.fileSize || 0;

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileSize = req.file.size;
      if (!fileName) {
        fileName = req.file.originalname;
      }
    }

    if (!fileName || !fileUrl) {
      return res.status(400).json({ success: false, message: "Please provide a file or fileUrl" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const attachment = await Attachment.create({
      fileName,
      fileUrl,
      fileSize,
      task: taskId,
    });

    res.status(201).json({ success: true, data: attachment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Delete an attachment
// @route   DELETE /api/attachments/:id
// @access  Private
const deleteAttachment = async (req, res) => {
  try {
    const attachment = await Attachment.findById(req.params.id);
    if (!attachment) {
      return res.status(404).json({ success: false, message: "Attachment not found" });
    }

    const task = await Task.findById(attachment.task);
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    await attachment.deleteOne();
    res.status(200).json({ success: true, message: "Attachment deleted", data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = { getAttachments, addAttachment, deleteAttachment };
