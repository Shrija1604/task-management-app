const mongoose = require("mongoose");

const attachmentSchema = mongoose.Schema(
  {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSize: { type: Number }, // in bytes
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attachment", attachmentSchema);
