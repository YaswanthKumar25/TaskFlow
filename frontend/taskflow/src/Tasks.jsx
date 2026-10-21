
import React, { useEffect, useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  function getErrorMessage(error) {
    const data = error.response?.data;

    if (data && typeof data === "object") {
      return Object.entries(data)
        .map(([field, messages]) => {
          const message = Array.isArray(messages)
            ? messages.join(" ")
            : typeof messages === "string"
              ? messages
              : JSON.stringify(messages);

          return `${field}: ${message}`;
        })
        .join("\n");
    }

    return error.message || "Something went wrong. Please try again.";
  }

  // Fetch the current user's tasks.
  useEffect(() => {
    async function fetchTasks() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        navigate("/");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await api.get("");
        setTasks(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        setError(
          `Failed to load tasks. ${
            getErrorMessage(error)
          }`
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [navigate]);

  function handleEdit(task) {
    navigate(`/edittask/${task.id}`);
  }

  function handleAddTask() {
    navigate("/addtask");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    setError("");
    setDeletingId(id);

    try {
      await api.delete(`${id}/`);

      setTasks((prev) =>
        prev.filter((task) => task.id !== id)
      );
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      setError(
        `Failed to delete task. ${
          getErrorMessage(error)
        }`
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <h1>Tasks</h1>

      {error && (
        <p role="alert" style={{ color: "red", whiteSpace: "pre-line" }}>
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task.id}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>

            <button onClick={() => handleEdit(task)}>
              Edit
            </button>

            <button
              onClick={() => handleDelete(task.id)}
              disabled={deletingId === task.id}
            >
              {deletingId === task.id
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        ))
      ) : (
        <p>No tasks found.</p>
      )}

      <button onClick={handleAddTask}>Add Task</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Tasks;
