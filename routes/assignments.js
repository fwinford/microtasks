/**
 * Assignment Routes
 * Handles CRUD operations for assignments and AI-powered task breakdown
 * 
 * External Dependencies:
 * - Express Router: https://expressjs.com/en/guide/routing.html
 * - OpenAI API: https://platform.openai.com/docs/api-reference
 * - Mongoose: https://mongoosejs.com/docs/queries.html
 * 
 * References:
 * - OpenAI Chat Completions: https://platform.openai.com/3docs/guides/chat
 * - RESTful API design: https://restfulapi.net/
 * - Caching strategies: https://redis.io/docs/manual/client-side-caching/
 */

import { Router } from "express";
import Assignment from "../models/Assignment.js";
import Task from "../models/Task.js";
import OpenAI from "openai";

const r = Router();

// OpenAI client will be initialized when needed

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

// POST /assignments/:id/breakdown/suggest → AI-powered task breakdown
r.post("/:id/breakdown/suggest", async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });

    // Check if we already have a cached AI breakdown (less than 24 hours old)
    const now = new Date();
    const cacheThreshold = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (assignment.aiBreakdown && assignment.aiBreakdownGeneratedAt) {
      const cacheAge = now - new Date(assignment.aiBreakdownGeneratedAt);
      if (cacheAge < cacheThreshold) {
        try {
          const cachedTasks = JSON.parse(assignment.aiBreakdown);
          return res.json({ 
            assignmentId: id, 
            tasks: cachedTasks,
            cached: true,
            generatedAt: assignment.aiBreakdownGeneratedAt
          });
        } catch (parseError) {
          console.warn("Failed to parse cached AI breakdown, generating new one");
        }
      }
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-api-key-here') {
      // Fallback to stub if no API key
      const suggestion = [
        { title: "Outline sections", etaMins: 30 },
        { title: "Draft intro", etaMins: 45 },
        { title: "Draft methods", etaMins: 60 }
      ];
      return res.json({ assignmentId: id, tasks: suggestion, note: "Using stub data - add OPENAI_API_KEY for AI suggestions" });
    }

    // Build context for AI prompt
    const dueDate = new Date(assignment.dueDate);
    const daysUntilDue = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
    
    const prompt = `Break down this academic assignment into 3-5 manageable micro-tasks:

Assignment: "${assignment.title}"
Course: ${assignment.courseId || "General"}
Due Date: ${dueDate.toLocaleDateString()} (${daysUntilDue} days from now)
Notes: ${assignment.notes || "None"}

Please suggest specific, actionable micro-tasks that a student should complete to finish this assignment on time. For each task, provide:
1. A clear, specific task title
2. Estimated time in minutes (be realistic)

Respond with ONLY a JSON array in this format:
[{"title": "Task description", "etaMins": 30}, {"title": "Another task", "etaMins": 45}]`;

    // Initialize OpenAI client and call API
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    });

    let aiResponse = completion.choices[0].message.content.trim();
    
    // Clean up the response to ensure it's valid JSON
    if (aiResponse.startsWith('```json')) {
      aiResponse = aiResponse.replace(/```json\n?/, '').replace(/\n?```/, '');
    }
    if (aiResponse.startsWith('```')) {
      aiResponse = aiResponse.replace(/```\n?/, '').replace(/\n?```/, '');
    }

    // Parse the AI response
    let tasks;
    try {
      tasks = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      // Fallback to stub if parsing fails
      tasks = [
        { title: "Research and outline", etaMins: 45 },
        { title: "Draft main content", etaMins: 90 },
        { title: "Review and edit", etaMins: 30 }
      ];
    }

    // Validate and clean up tasks
    const validTasks = tasks.filter(task => 
      task.title && 
      typeof task.title === 'string' && 
      task.etaMins && 
      typeof task.etaMins === 'number'
    ).slice(0, 6); // Limit to 6 tasks max

    // Cache the AI breakdown in the database to avoid repeated API calls
    try {
      await Assignment.findByIdAndUpdate(id, {
        aiBreakdown: JSON.stringify(validTasks),
        aiBreakdownGeneratedAt: new Date()
      });
    } catch (cacheError) {
      console.warn("Failed to cache AI breakdown:", cacheError);
    }

    res.json({ 
      assignmentId: id, 
      tasks: validTasks,
      aiGenerated: true,
      cached: false
    });

  } catch (error) {
    console.error("AI Breakdown Error:", error);
    // Fallback to stub on any error
    const fallbackTasks = [
      { title: "Plan and research", etaMins: 30 },
      { title: "Create outline", etaMins: 20 },
      { title: "Draft content", etaMins: 60 },
      { title: "Review and revise", etaMins: 30 }
    ];
    res.json({ 
      assignmentId: req.params.id, 
      tasks: fallbackTasks,
      error: "AI service temporarily unavailable - using fallback suggestions"
    });
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

// DELETE /assignments/:id → delete assignment and all its tasks
r.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if assignment exists
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    
    // Delete all tasks associated with this assignment
    await Task.deleteMany({ assignmentId: id });
    
    // Delete the assignment
    await Assignment.findByIdAndDelete(id);
    
    res.json({ 
      message: "Assignment and associated tasks deleted successfully",
      deletedAssignment: assignment.title 
    });
  } catch (e) {
    next(e);
  }
});

export default r;
