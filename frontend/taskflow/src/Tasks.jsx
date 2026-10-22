import React, { useEffect, useState } from "react";
import api from "./api";
import { Navigate, useNavigate } from "react-router-dom";
const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const in_progressTasks = tasks.filter(
    (task) => task.status === "in_progress",
  );
  const pendingTasks = tasks.filter((task) => task.status === "pending");

  async function getTasks() {
    try {
      const response = await api.get("");
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    const Token = localStorage.getItem("token");
    if (!Token) {
      navigate("/");
    }
    getTasks();
  }, []);

  return (
    <div className="border-2 min-h-screen flex flex-col  items-center bg-gray-300">
      <h1>Tasks</h1>
      <div className="border-2 grid lg:grid-cols-3 sm:grid-cols-2 w-full px-10 py-5 gap-20 bg-white rounded-2xl">
        <div className="flex flex-col border-red-500 border w-full">
          <h1 className="text-center text-2xl font-semibold">
            Completed Tasks
          </h1>
          {completedTasks.map((task) => (
            <div className="flex flex-col gap-2 text-xl p-3">
              <h1>{task.title}</h1>
              <h2>{task.description}</h2>
              <h2>{task.due_date}</h2>
              <h2>{task.status}</h2>
              <h2>{task.priority}</h2>
            </div>
          ))}
        </div>
        <div className="flex flex-col border-red-500 border w-full">
          <h1 className="text-center text-2xl font-semibold">
            in_progress Tasks
          </h1>
          {in_progressTasks.map((task) => (
            <div className="flex flex-col gap-2 text-xl p-3">
              <h1>{task.title}</h1>
              <h2>{task.description}</h2>
              <h2>{task.due_date}</h2>
              <h2>{task.status}</h2>
              <h2>{task.priority}</h2>
            </div>
          ))}
        </div>
        <div className="flex flex-col border-red-500 border w-full">
          <h1 className="text-center text-2xl font-semibold">pending Tasks</h1>
          {pendingTasks.map((task) => (
            <div className="flex flex-col gap-2 text-xl p-3">
              <h1>{task.title}</h1>
              <h2>{task.description}</h2>
              <h2>{task.due_date}</h2>
              <h2>{task.status}</h2>
              <h2>{task.priority}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
