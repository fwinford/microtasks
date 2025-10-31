import { Router } from "express";
import Assignment from "../models/Assignment.js";
import Task from "../models/Task.js";

const r = Router();

// GET /assignments?next7=1 → assignments due in next 7 days
r.get("/", async (req, res, next) => {
  try {
    if (req.query.next7) {
      const now = new Date();
      const in7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const list = await Assignment.find({ dueDate: { $gte: now, $lte: in7 } }).sort({ dueDate: 1 });
      return res.json(list);
    }
    const list = await Assignment.find().sort({ dueDate: 1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

// POST /assignments → create
r.post("/", async (req, res, next) => {
  try {
    const { title, dueDate, courseId, notes } = req.body;
    if (!title) throw new Error("title required");
    const due = new Date(dueDate);
    if (isNaN(due)) throw new Error("invalid dueDate");
    const doc = await Assignment.create({ title, dueDate: due, courseId, notes });
    res.status(201).json(doc);
  } catch (e) {
    next(e);
  }
});

// POST /assignments/:id/breakdown/suggest → stub for AI later
r.post("/:id/breakdown/suggest", async (req, res, next) => {
  try {
    const { id } = req.params;
    const a = await Assignment.findById(id);
    if (!a) return res.status(404).json({ error: "Assignment not found" });

    const suggestion = [
      { title: "Outline sections", etaMins: 30 },
      { title: "Draft intro", etaMins: 45 },
      { title: "Draft methods", etaMins: 60 }
    ];
    res.json({ assignmentId: id, tasks: suggestion });
  } catch (e) {
    next(e);
  }
});

// POST /assignments/:id/breakdown/apply → create tasks from approved suggestion
r.post("/:id/breakdown/apply", async (req, res, next) => {
  try {
    const { id } = req.params;
    const tasks = Array.isArray(req.body.tasks) ? req.body.tasks : [];
    const docs = await Task.insertMany(
      tasks.map((t) => ({
        assignmentId: id,
        title: t.title,
        etaMins: t.etaMins,
        plannedDate: t.plannedDate
      }))
    );
    res.status(201).json(docs);
  } catch (e) {
    next(e);
  }
});

export default r;
