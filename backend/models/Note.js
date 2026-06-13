const mongoose = require("mongoose");

const noteSchema = mongoose.Schema(
  {
    content: { type: String, required: true },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
