import { useNavigate } from "react-router-dom";
import api from "./api";
import React, { useState } from "react";

const Login = () => {
  const [userdata, setUserData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  function onchange(e) {
    setUserData({ ...userdata, [e.target.name]: e.target.value });
  }

  async function onsubmit(e) {
    e.preventDefault();
    try {
      const response = await api.post("login/", userdata);
      const token = response.data.token;
      localStorage.setItem("token", token);
      if (token) {
        navigate("/tasks");
      }
      console.log(localStorage.getItem("token"));
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <form onSubmit={(e) => onsubmit(e)}>
        <label htmlFor="username">UserName : </label>
        <input
          type="text"
          placeholder="username"
          onChange={(e) => onchange(e)}
          name="username"
        />
        <label htmlFor="password">password : </label>
        <input
          type="password"
          placeholder="password"
          onChange={(e) => onchange(e)}
          name="password"
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Login;
