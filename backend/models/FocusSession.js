const mongoose = require("mongoose");

const focusSessionSchema = mongoose.Schema(
  {
    duration: { type: Number, required: true }, // in minutes
    startTime: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FocusSession", focusSessionSchema);
