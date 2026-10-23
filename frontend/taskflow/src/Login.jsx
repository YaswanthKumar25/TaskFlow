import { useNavigate } from "react-router-dom";
import api from "./api";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRepeat,
  faUser,
  faUserLock,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
const Login = () => {
  const [userdata, setUserData] = useState({
    username: "",
    password: "",
  });
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  function onchange(e) {
    setUserData({ ...userdata, [e.target.name]: e.target.value });
  }

  async function onsubmit(e) {
    e.preventDefault();
    setVerifying(true);
    try {
      const response = await api.post("login/", userdata);
      const token = response.data.token;
      localStorage.setItem("token", token);
      toast.success("logined Success");
      if (token) {
        navigate("/tasks");
      }
      console.log(localStorage.getItem("token"));
    } catch (error) {
      toast.error(error.response?.data.error);
    } finally {
      setVerifying(false);
    }
  }
  return (
    <>
      <div className="flex justify-center items-center h-screen w-screen bg-gray-200">
        <form
          onSubmit={(e) => onsubmit(e)}
          className="  flex flex-col gap-5 p-5 shadow-2xl bg-white rounded-2xl text-xl lg:text-2xl"
        >
          <label htmlFor="username">
            {" "}
            <FontAwesomeIcon icon={faUser} /> UserName{" "}
          </label>
          <input
            className=" rounded-2xl p-2 outline-1  focus:outline-2 outline-blue-500 transition-all ease-out duration-300 hover:rounded-xl"
            type="text"
            placeholder="username"
            onChange={(e) => onchange(e)}
            name="username"
            required
          />
          <label htmlFor="password">
            <FontAwesomeIcon icon={faUserLock} /> password{" "}
          </label>
          <input
            className=" rounded-2xl p-2 outline-1  focus:outline-2 outline-blue-500 transition-all ease-out duration-300 hover:rounded-xl"
            type="password"
            placeholder="password"
            onChange={(e) => onchange(e)}
            name="password"
            required
          />
          <button
            type="submit"
            className=" rounded-2xl p-2 outline-1  focus:outline-2 outline-blue-500 transition-all ease-out duration-300 hover:rounded-xl bg-blue-500 text-white text-2xl  hover:bg-blue-600"
          >
            {verifying ? (
              <h1>
                <FontAwesomeIcon icon={faSpinner} spin />
                verifying
              </h1>
            ) : (
              "Login"
            )}
          </button>
          <p className="active:text-blue-500 text-xl hover:text-blue-600 text-blue-700 cursor-pointer">
            <FontAwesomeIcon icon={faRepeat} /> Forgot password ?
          </p>
          <p className="cursor-pointer">
            <FontAwesomeIcon icon={faUserPen} /> Don't have an account ?
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
