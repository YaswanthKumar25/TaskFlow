import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
const Task = ({ task, deleteTask, edittask, varient, setEditTask }) => {
  const varients = {
    completed: "bg-green-400",
    in_progress: "bg-yellow-400 ",
    pending: "bg-white",
  };
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };
  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };
  const formattedStatus = task.status
    .replace("_", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return (
    <div className="my-3 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <h1 className="break-words text-lg font-semibold text-gray-800">
        {task.title}
      </h1>
      <p className="break-words whitespace-pre-wrap text-sm leading-6 text-gray-600">
        {task.description}
      </p>
      <h2>{task.due_date}</h2>
      <div className=" flex items-center gap-3">
        <h2
          className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium ${
            statusColors[task.status]
          }`}
        >
          {formattedStatus}
        </h2>
        <h2
          className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </h2>
      </div>
      <div className="flex flex-col gap-5 mt-5">
        <button
          aria-label={`Edit task: ${task.title}`}
          onClick={() => edittask(task)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
        >
          <FontAwesomeIcon icon={faPencil} aria-label="true" /> Edit
        </button>
        <button
          aria-label={`Delete task: ${task.title}`}
          onClick={() => deleteTask(task.id)}
          className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-700"
        >
          <FontAwesomeIcon icon={faTrash} aria-label="true" /> Delete
        </button>
      </div>
    </div>
  );
};

export default Task;
