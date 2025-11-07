/**
 * Task Model
 * MongoDB schema for micro-tasks that break down assignments
 * 
 * External Dependencies:
 * - Mongoose: https://mongoosejs.com/docs/guide.html
 * 
 * References:
 * - Mongoose schemas: https://mongoosejs.com/docs/guide.html
 * - Schema references: https://mongoosejs.com/docs/populate.html
 * - Enum validation: https://mongoosejs.com/docs/validation.html#built-in-validators
 */

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
