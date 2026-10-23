import React, { useEffect, useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceFrownOpen,
  faPencil,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import AddTask from "./AddTask";
import Task from "./Task";
const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [loading, setloading] = useState(true);
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const in_progressTasks = tasks.filter(
    (task) => task.status === "in_progress",
  );
  const pendingTasks = tasks.filter((task) => task.status === "pending");

  async function getTasks() {
    try {
      const response = await api.get("");
      setTasks(response.data);
      setloading(false);
    } catch (error) {
      console.log(error.response.status);
    }
  }
  function edittask(task) {
    setEditTask(task);
  }
  async function deleteTask(id) {
    try {
      await api.delete(`${id}/`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success("Task has been deleted successfuly");
    } catch {
      toast.error(error);
    }
  }
  useEffect(() => {
    const Token = localStorage.getItem("token");
    if (!Token) {
      navigate("/");
      return;
    }
    getTasks();
  }, []);

  return (
    <>
      <div className=" min-h-screen flex w-screen bg-gray-300 ">
        {loading ? (
          <h1 className="text-5xl text-center">
            <FontAwesomeIcon icon={faSpinner} spin /> Loading ...
          </h1>
        ) : (
          <>
            <div className="lg:w-full grid lg:grid-cols-3 sm:grid-cols-2 px-5 py-5 gap-10 ">
              <div className="flex flex-col w-full">
                <h1 className="text-center sm:text-xl lg:text-2xl font-semibold">
                  Completed Tasks
                </h1>
                {completedTasks.length > 0 ? (
                  completedTasks.map((task) => (
                    <Task
                      task={task}
                      deleteTask={deleteTask}
                      edittask={edittask}
                    />
                  ))
                ) : (
                  <h1 className="text-3xl text-center my-5 animate-pulse">
                    <FontAwesomeIcon icon={faFaceFrownOpen} /> There is No
                    Completed Tasks
                  </h1>
                )}
              </div>
              <div className="flex flex-col  w-full">
                <h1 className="text-center text-2xl font-semibold">
                  in_progress Tasks
                </h1>
                {in_progressTasks.length > 0 ? (
                  in_progressTasks.map((task) => (
                    <Task
                      task={task}
                      deleteTask={deleteTask}
                      edittask={edittask}
                    />
                  ))
                ) : (
                  <h1 className="text-3xl text-center my-5 animate-pulse">
                    <FontAwesomeIcon icon={faFaceFrownOpen} /> There is No
                    in_progress Tasks
                  </h1>
                )}
              </div>
              <div className="flex flex-col  w-full">
                <h1 className="text-center text-2xl font-semibold">
                  pending Tasks
                </h1>
                {pendingTasks.length > 0 ? (
                  pendingTasks.map((task) => (
                    <Task
                      task={task}
                      deleteTask={deleteTask}
                      edittask={edittask}
                    />
                  ))
                ) : (
                  <h1 className="text-3xl text-center my-5 animate-pulse">
                    <FontAwesomeIcon icon={faFaceFrownOpen} /> There is No
                    pending Tasks
                  </h1>
                )}
              </div>
            </div>
            <div className="sticky top-0 h-screen overflow-scroll">
              <AddTask getTasks={getTasks} editTask={editTask} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Tasks;
