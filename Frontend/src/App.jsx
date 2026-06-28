import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://task-traker-mern.onrender.com";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [editId, setEditId] = useState(null);

  const getTasks = async () => {
    try {
      const res = await axios.get(`${API}/api/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.log("GET ERROR:", err);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim() === "") {
      alert("Task title is required");
      return;
    }

    const task = { title, description, status };

    try {
      if (editId) {
        await axios.put(`${API}/api/tasks/${editId}`, task);
        setEditId(null);
      } else {
        await axios.post(`${API}/api/tasks`, task);
      }

      setTitle("");
      setDescription("");
      setStatus("Pending");
      getTasks();
      alert("Task saved successfully");
    } catch (err) {
      console.log("SAVE ERROR:", err);
      alert("Error: " + err.message);
    }
  };

  const editTask = (task) => {
    setEditId(task._id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/api/tasks/${id}`);
      getTasks();
    } catch (err) {
      console.log("DELETE ERROR:", err);
      alert("Delete error: " + err.message);
    }
  };

  return (
    <div className="container">
      <h1>Task Tracker</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <button type="submit">{editId ? "Update Task" : "Add Task"}</button>
      </form>

      <hr />

      {tasks.map((task) => (
        <div className="card" key={task._id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>

          <button onClick={() => editTask(task)}>Edit</button>
          <button onClick={() => deleteTask(task._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;