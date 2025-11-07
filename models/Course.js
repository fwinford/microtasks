/**
 * Course Model (UNUSED - kept for potential future use)
 * MongoDB schema for course information
 * 
 * Note: This model is currently not used in the application.
 * Courses are stored as simple strings in the Assignment.courseId field.
 * This file is kept for potential future enhancement.
 * 
 * External Dependencies:
 * - Mongoose: https://mongoosejs.com/docs/guide.html
 */

import mongoose from "mongoose";
const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true }
  },
  { timestamps: true }
);
export default mongoose.model("Course", CourseSchema);
