import React, { useCallback, useEffect, useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceFrownOpen, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import AddTask from "./AddTask";
import Task from "./Task";
import { getErrorMessage } from "./utils";

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

  const getTasks = useCallback(async () => {
    try {
      const response = await api.get("");
      setTasks(response.data);
    } catch (error) {
      console.log("API", error);
      toast.error(getErrorMessage(error));
    } finally {
      setloading(false);
    }
  }, []);

  function setedittasknull() {
    setEditTask(null);
  }
  function edittask(task) {
    setEditTask(task);
  }
  async function deleteTask(id) {
    const conf = window.confirm("are you sure to delete");
    console.log(conf);
    if (conf) {
      try {
        await api.delete(`${id}/`);
        setTasks((prev) => prev.filter((task) => task.id !== id));
        setEditTask((prev) => (prev?.id === id ? null : prev));
        toast.success("Task has been deleted successfuly");
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
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
      <div className="flex min-h-screen w-full flex-col bg-gray-300 lg:flex-row">
        {loading ? (
          <h1 className="text-5xl text-center">
            <FontAwesomeIcon icon={faSpinner} spin /> Loading ...
          </h1>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 px-4 py-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8 lg:w-full">
              <div className="flex flex-col w-full">
                <h1 className="text-center sm:text-xl lg:text-2xl font-semibold">
                  Completed Tasks
                </h1>
                {completedTasks.length > 0 ? (
                  completedTasks.map((task) => (
                    <Task
                      key={task.id}
                      task={task}
                      deleteTask={deleteTask}
                      edittask={edittask}
                      varient={"completed"}
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
                      key={task.id}
                      task={task}
                      deleteTask={deleteTask}
                      edittask={edittask}
                      varient={"in_progress"}
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
                      key={task.id}
                      task={task}
                      deleteTask={deleteTask}
                      edittask={edittask}
                      varient={"pending"}
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
            <div className="h-auto w-full lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:shrink-0 lg:overflow-y-auto">
              <AddTask
                getTasks={getTasks}
                editTask={editTask}
                setedittasknull={setedittasknull}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Tasks;
