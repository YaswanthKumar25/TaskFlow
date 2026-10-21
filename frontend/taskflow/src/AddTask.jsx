
import React, { useEffect, useState } from "react";
import api from "./api";
import { useNavigate, useParams } from "react-router-dom";

const AddTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [editTask, setEditTask] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [task, setTask] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "",
    priority: "",
  });

  // Convert API errors into readable messages.
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

  // Fetch a task only when editing.
  useEffect(() => {
    if (!id) return;

    async function fetchTask() {
      setLoadingEdit(true);
      setError("");

      try {
        const response = await api.get(`${id}/`);
        setEditTask(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        setError(getErrorMessage(error));
      } finally {
        setLoadingEdit(false);
      }
    }

    fetchTask();
  }, [id, navigate]);

  // Populate the form with existing task details.
  useEffect(() => {
    if (!editTask) return;

    setTask({
      title: editTask.title || "",
      description: editTask.description || "",
      due_date: editTask.due_date
        ? editTask.due_date.slice(0, 16)
        : "",
      status: editTask.status || "",
      priority: editTask.priority || "",
    });
  }, [editTask]);

  function handleChange(e) {
    const { name, value } = e.target;

    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  }

  async function submitData(e) {
    e.preventDefault();
    setError("");

    // Validate title.
    const title = task.title.trim();

    if (title.length < 3) {
      setError("Title must contain at least 3 characters.");
      return;
    }

    // Validate due date.
    if (!task.due_date) {
      setError("Please select a due date.");
      return;
    }

    const selectedDate = new Date(task.due_date);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate.getTime() <= Date.now()
    ) {
      setError("Due date must be in the future.");
      return;
    }

    // Send the cleaned title to Django.
    const payload = {
      ...task,
      title,
    };

    setSaving(true);

    try {
      if (id) {
        await api.put(`${id}/`, payload);
      } else {
        await api.post("", payload);
      }

      navigate("/tasks");
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      setError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  if (loadingEdit) {
    return <p>Loading task details...</p>;
  }

  return (
    <div>
      <h2>{id ? "Update Task" : "Add Task"}</h2>

      {error && (
        <p role="alert" style={{ color: "red", whiteSpace: "pre-line" }}>
          {error}
        </p>
      )}

      <form onSubmit={submitData}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          placeholder="Enter title"
          value={task.title}
          onChange={handleChange}
          required
          minLength={3}
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Enter description"
          value={task.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="due_date">Due date</label>
        <input
          id="due_date"
          type="datetime-local"
          name="due_date"
          value={task.due_date}
          onChange={handleChange}
          required
        />

        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={task.status}
          onChange={handleChange}
          required
        >
          <option value="">Select status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          name="priority"
          value={task.priority}
          onChange={handleChange}
          required
        >
          <option value="">Select priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : id
              ? "Update Task"
              : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default AddTask;
