import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
const Task = ({ task, deleteTask, edittask, varient }) => {
  const varients = {
    completed: "bg-green-400",
    in_progress: "bg-yellow-400 ",
    pending: "bg-white",
  };
  return (
    <div
      className={`flex flex-col gap-2 text-xl p-3 ${varients[varient]} rounded-2xl my-3`}
    >
      <h1>{task.title}</h1>
      <h2>{task.description}</h2>
      <h2>{task.due_date}</h2>
      <h2>{task.status}</h2>
      <h2>{task.priority}</h2>
      <div className="flex flex-col gap-5 mt-5">
        <button
          onClick={() => edittask(task)}
          className=" rounded-3xl text-2xl py-1 transition-all duration-300 ease-out hover:rounded-2xl bg-gray-600 text-white font-mono font-extrabold"
        >
          <FontAwesomeIcon icon={faPencil} /> Edit
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          className=" rounded-3xl text-2xl py-1 transition-all duration-300 ease-out hover:rounded-2xl bg-red-500 text-white font-mono font-extrabold"
        >
          <FontAwesomeIcon icon={faTrash} /> Delete
        </button>
      </div>
    </div>
  );
};

export default Task;
