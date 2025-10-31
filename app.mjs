import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import assignmentsRouter from "./routes/assignments.js";
import tasksRouter from "./routes/tasks.js";

dotenv.config();
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/microdeadlines";
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to Mongo"))
  .catch((err) => console.error("Mongo connection error:", err.message));

// Routes
app.get("/", (req, res) => res.json({ ok: true, message: "Micro-Deadlines API skeleton" }));
app.use("/assignments", assignmentsRouter);
app.use("/tasks", tasksRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: err.message || "Unknown error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
export default app;