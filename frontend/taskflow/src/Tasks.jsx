import React, { useEffect, useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  const [Tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  async function getTasks() {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    try {
      const response = await api.get("");
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getTasks();
  }, []);

  function Logout() {
    localStorage.removeItem("token");
    navigate("/");
  }
  function addtask() {
    navigate("/addtask");
  }

  return (
    <>
      <div>Tasks</div>
      {Tasks.map((task) => (
        <h1 key={task.id}>{task.title}</h1>
      ))}
      <button onClick={Logout}>Logout</button>
      <button onClick={addtask}>AddTask</button>
    </>
  );
};

export default Tasks;
