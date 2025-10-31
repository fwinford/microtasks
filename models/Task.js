import mongoose from "mongoose";
const TaskSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true
    },
    title: { type: String, required: true, trim: true },
    status: { type: String, enum: ["todo", "done"], default: "todo" },
    etaMins: { type: Number, min: 1 },
    plannedDate: { type: Date }
  },
  { timestamps: true }
);
TaskSchema.index({ assignmentId: 1 });
export default mongoose.model("Task", TaskSchema);
