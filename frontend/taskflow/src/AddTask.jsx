import React, { useEffect, useState } from "react";
import api from "./api";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faCartShopping,
  faChartSimple,
  faFireFlameCurved,
  faHeart,
  faPencil,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

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
      due_date: editTask.due_date ? editTask.due_date.slice(0, 16) : "",
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
      toast.error("Title must contain at least 3 characters.");
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
      toast.error("Due date must be in the future.");
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
    <>
      <div className=" min-h-screen h-auto p-5 flex flex-col gap-5 bg-gray-300">
        <h2 className="text-center text-5xl">
          {id ? "Update Task" : "Add Task"}
        </h2>

        {error && (
          <p role="alert" style={{ color: "red", whiteSpace: "pre-line" }}>
            {error}
          </p>
        )}
        <div className=" flex justify-center ">
          <form
            onSubmit={submitData}
            className="bg-gray-50 rounded-2xl w-full flex flex-col justify-center px-5 py-3 lg:w-1/2 gap-3"
          >
            <label htmlFor="title" className="text-xl  font-mono">
              <FontAwesomeIcon icon={faPencil} /> Title
            </label>
            <input
              className="border rounded-2xl p-2 text-xl outline-1 outline-blue-400 active:outline-blue-600"
              id="title"
              type="text"
              name="title"
              placeholder="Enter title"
              value={task.title}
              onChange={handleChange}
              required
              minLength={3}
            />

            <label htmlFor="description" className="text-xl  font-mono">
              {" "}
              <FontAwesomeIcon icon={faPenToSquare} /> Description
            </label>
            <textarea
              className="border rounded-2xl p-2 text-xl outline-1 outline-blue-400 active:outline-blue-600"
              id="description"
              name="description"
              placeholder="Enter description"
              value={task.description}
              onChange={handleChange}
              required
            />

            <label htmlFor="due_date" className="text-xl  font-mono">
              <FontAwesomeIcon icon={faCalendarDays} /> Due date
            </label>
            <input
              className="border rounded-2xl p-2 text-xl outline-1 outline-blue-400 active:outline-blue-600"
              id="due_date"
              type="datetime-local"
              name="due_date"
              value={task.due_date}
              onChange={handleChange}
              required
            />

            <label htmlFor="status" className="text-xl  font-mono">
              <FontAwesomeIcon icon={faFireFlameCurved} /> Status
            </label>
            <select
              className="border rounded-2xl p-2 text-xl outline-1 outline-blue-400 active:outline-blue-600"
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

            <label htmlFor="priority" className="text-xl  font-mono">
              <FontAwesomeIcon icon={faChartSimple} /> Priority
            </label>
            <select
              className="border rounded-2xl p-2 text-xl outline-1 outline-blue-400 active:outline-blue-600"
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

            <button
              type="submit"
              disabled={saving}
              className="text-2xl border p-2 rounded-2xl bg-blue-600 text-white font-semibold font-sans my-5 transition-all duration-300 ease-out hover:scale-105"
            >
              {saving ? "Saving..." : id ? "Update Task" : "Add Task"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddTask;
