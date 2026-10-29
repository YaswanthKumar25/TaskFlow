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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [editTask, setEditTask] = useState(null);
  const [loading, setloading] = useState(true);
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });
  const hasActiveFilters =
    search.trim() !== "" || statusFilter !== "all" || priorityFilter !== "all";

  const completedTasks = filteredTasks.filter(
    (task) => task.status === "completed",
  );

  const in_progressTasks = filteredTasks.filter(
    (task) => task.status === "in_progress",
  );

  const pendingTasks = filteredTasks.filter(
    (task) => task.status === "pending",
  );

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
      <div className="flex min-h-screen w-full flex-col bg-gray-300">
        {loading ? (
          <h1 className="text-5xl text-center">
            <FontAwesomeIcon icon={faSpinner} spin /> Loading ...
          </h1>
        ) : (
          <>
            <div className="w-full px-4 pt-5">
              <input
                type="text"
                placeholder="Search tasks by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="w-full px-4 pb-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none sm:w-64"
                aria-label="Filter tasks by status"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none sm:w-64"
              aria-label="Filter tasks by priority"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
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
                  <div className="my-5 flex flex-col items-center gap-3 text-center text-gray-500">
                    <FontAwesomeIcon
                      icon={faFaceFrownOpen}
                      className="text-3xl"
                      aria-hidden="true"
                    />
                    <p className="text-base">
                      {hasActiveFilters
                        ? "No matching Completed tasks found."
                        : "No Completed tasks yet. Create a task to get started!"}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col  w-full">
                <h1 className="text-center text-xl font-semibold lg:text-2xl">
                  In Progress Tasks
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
                  <div className="my-5 flex flex-col items-center gap-3 text-center text-gray-500">
                    <FontAwesomeIcon
                      icon={faFaceFrownOpen}
                      className="text-3xl"
                      aria-hidden="true"
                    />
                    <p className="text-base">
                      {hasActiveFilters
                        ? "No matching In Progress tasks found."
                        : "No In Progress tasks yet. Create a task to get started!"}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col  w-full">
                <h1 className="text-center text-xl font-semibold lg:text-2xl">
                  Pending
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
                  <div className="my-5 flex flex-col items-center gap-3 text-center text-gray-500">
                    <FontAwesomeIcon
                      icon={faFaceFrownOpen}
                      className="text-3xl"
                      aria-hidden="true"
                    />
                    <p className="text-base">
                      {hasActiveFilters
                        ? "No matching pending tasks found."
                        : "No pending tasks yet. Create a task to get started!"}
                    </p>
                  </div>
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
