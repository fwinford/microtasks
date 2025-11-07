/**
 * Assignment Model
 * MongoDB schema for academic assignments with AI breakdown caching
 * 
 * External Dependencies:
 * - Mongoose: https://mongoosejs.com/docs/guide.html
 * 
 * References:
 * - Mongoose schemas: https://mongoosejs.com/docs/guide.html
 * - Schema types: https://mongoosejs.com/docs/schematypes.html
 * - Indexing: https://www.mongodb.com/docs/manual/indexes/
 * - Timestamps: https://mongoosejs.com/docs/timestamps.html
 */

import mongoose from "mongoose";
const AssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    courseId: { type: String, trim: true }, // Changed from ObjectId to String for simple course codes like "CS101"
    dueDate: { type: Date, required: true },
    notes: { type: String, trim: true },
    aiBreakdown: { type: String, trim: true }, // Store AI-generated task breakdown to avoid repeated API calls
    aiBreakdownGeneratedAt: { type: Date } // Track when AI breakdown was created
  },
  { timestamps: true }
);
AssignmentSchema.index({ dueDate: 1 });
export default mongoose.model("Assignment", AssignmentSchema);
