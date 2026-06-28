const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Task Tracker Backend is running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: { type: String, default: "Pending" }
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

app.post("/api/tasks", async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});

app.put("/api/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(task);
});

app.delete("/api/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});