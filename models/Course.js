import mongoose from "mongoose";
const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true }
  },
  { timestamps: true }
);
export default mongoose.model("Course", CourseSchema);
