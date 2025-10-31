import mongoose from "mongoose";
const AssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    dueDate: { type: Date, required: true },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);
AssignmentSchema.index({ dueDate: 1 });
export default mongoose.model("Assignment", AssignmentSchema);
