import { Router } from "express";
import Task from "../models/Task.js";

const r = Router();

// PATCH /tasks/:id/toggle → mark done/undo (AJAX-y)
r.patch("/:id/toggle", async (req, res, next) => {
  try {
    const t = await Task.findById(req.params.id);
    if (!t) return res.status(404).json({ error: "Task not found" });
    t.status = t.status === "done" ? "todo" : "done";
    await t.save();
    res.json(t);
  } catch (e) {
    next(e);
  }
});

// GET /tasks?day=YYYY-MM-DD → filter by plannedDate
r.get("/", async (req, res, next) => {
  try {
    const { day } = req.query;
    if (!day) return res.json(await Task.find().sort({ createdAt: -1 }));
    const start = new Date(day);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const list = await Task.find({ plannedDate: { $gte: start, $lt: end } }).sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

export default r;
// POST /tasks → create
r.post("/", async (req, res, next) => {
  try {
    const { assignmentId, title, etaMins, plannedDate } = req.body;
    if (!assignmentId) throw new Error("assignmentId required");
    if (!title) throw new Error("title required");
    const pd = plannedDate ? new Date(plannedDate) : null;
    if (plannedDate && isNaN(pd)) throw new Error("invalid plannedDate");
    const doc = await Task.create({ assignmentId, title, etaMins, plannedDate: pd });
    res.status(201).json(doc);
  } catch (e) {
    next(e);
  }
});
