import React, { useState } from "react";
import api from "./api";

const AddTask = () => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "",
    priority: "",
  });

  function onchange(e) {
    setTask({ ...task, [e.target.name]: e.target.value });
  }

  async function submitdata(e) {
    e.preventDefault();
    try {
      const response = await api.post("", task);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div>AddTask</div>
      <form onSubmit={(e) => submitdata(e)}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          placeholder="Enter Title"
          onChange={(e) => onchange(e)}
        />
        <label htmlFor="description">description</label>
        <textarea
          type="text"
          name="description"
          placeholder="Enter description"
          onChange={(e) => onchange(e)}
        />
        <label htmlFor="due_date">due_date</label>
        <input
          type="datetime-local"
          name="due_date"
          placeholder="Enter due_date"
          onChange={(e) => onchange(e)}
        />
        <label htmlFor="status">status</label>
        <select value={task.status} name="status" onChange={(e) => onchange(e)}>
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <label htmlFor="priority">priority</label>
        <select
          value={task.priority}
          name="priority"
          onChange={(e) => onchange(e)}
        >
          <option value="">Select priority</option>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <button type="submit">AddTask</button>
      </form>
    </>
  );
};

export default AddTask;
