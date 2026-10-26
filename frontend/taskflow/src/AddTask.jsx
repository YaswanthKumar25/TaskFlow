import React, { useEffect, useState } from "react";
import api from "./api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faChartSimple,
  faFireFlameCurved,
  faPencil,
  faPenToSquare,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { getErrorMessage } from "./utils";

const AddTask = ({ getTasks, editTask }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [task, setTask] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "",
    priority: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!editTask) {
      setTask({
        title: "",
        description: "",
        due_date: "",
        status: "",
        priority: "",
      });
      setErrors({});
      return;
    }

    setTask({
      title: editTask.title || "",
      description: editTask.description || "",
      due_date: editTask.due_date ? editTask.due_date.slice(0, 16) : "",
      status: editTask.status || "",
      priority: editTask.priority || "",
    });

    setErrors({});
  }, [editTask]);

  function handleChange(e) {
    const { name, value } = e.target;

    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  async function submitData(e) {
    e.preventDefault();

    if (isSubmitting) return;

    const title = task.title.trim();

    if (title.length < 3) {
      const message = "Title must contain at least 3 characters.";

      setErrors((prev) => ({
        ...prev,
        title: message,
      }));

      toast.error(message);
      return;
    }

    const selectedDate = new Date(task.due_date);

    if (
      !task.due_date ||
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate.getTime() <= Date.now()
    ) {
      const message = "Due date must be in the future.";

      setErrors((prev) => ({
        ...prev,
        due_date: message,
      }));

      toast.error(message);
      return;
    }

    setIsSubmitting(true);

    try {
      if (editTask) {
        await api.put(`${editTask.id}/`, {
          ...task,
          title,
        });

        toast.success("Task updated successfully.");
      } else {
        await api.post("", {
          ...task,
          title,
        });

        toast.success("Task created successfully.");
      }

      await getTasks();
    } catch (error) {
      console.error("Task submission error:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen h-auto p-5 flex flex-col gap-5 bg-gray-300">
      <h2 className="text-center sm:text-3xl lg:text-5xl font-bold">
        {editTask ? "Update Task" : "Add Task"}
      </h2>

      <div className="flex justify-center">
        <form
          onSubmit={submitData}
          className="sm:text-sm lg:text-xl bg-gray-50 rounded-2xl w-full flex flex-col justify-center px-5 py-3 gap-3"
        >
          <label htmlFor="title" className="font-mono">
            <FontAwesomeIcon icon={faPencil} /> Title
          </label>

          <input
            className="border rounded-2xl p-2 outline-1 outline-blue-400 active:outline-blue-600"
            id="title"
            type="text"
            name="title"
            placeholder="Enter title"
            value={task.title}
            onChange={handleChange}
            required
            minLength={3}
          />

          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}

          <label htmlFor="description" className="font-mono">
            <FontAwesomeIcon icon={faPenToSquare} /> Description
          </label>

          <textarea
            className="border rounded-2xl p-2 outline-1 outline-blue-400 active:outline-blue-600"
            id="description"
            name="description"
            placeholder="Enter description"
            value={task.description}
            onChange={handleChange}
            required
          />

          <label htmlFor="due_date" className="font-mono">
            <FontAwesomeIcon icon={faCalendarDays} /> Due date
          </label>

          <input
            className="border rounded-2xl p-2 outline-1 outline-blue-400 active:outline-blue-600"
            id="due_date"
            type="datetime-local"
            name="due_date"
            value={task.due_date}
            onChange={handleChange}
            required
          />

          {errors.due_date && (
            <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>
          )}

          <label htmlFor="status" className="font-mono">
            <FontAwesomeIcon icon={faFireFlameCurved} /> Status
          </label>

          <select
            className="border rounded-2xl p-2 outline-1 outline-blue-400 active:outline-blue-600"
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

          <label htmlFor="priority" className="font-mono">
            <FontAwesomeIcon icon={faChartSimple} /> Priority
          </label>

          <select
            className="border rounded-2xl p-2 outline-1 outline-blue-400 active:outline-blue-600"
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
            disabled={isSubmitting}
            className="text-2xl border p-2 rounded-2xl bg-blue-600 text-white font-semibold font-sans my-5 transition-all duration-300 ease-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Saving...
              </>
            ) : editTask ? (
              "Update Task"
            ) : (
              "Add Task"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
