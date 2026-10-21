import { useState } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";
import Login from "./Login";
import Tasks from "./Tasks";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddTask from "./AddTask";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Login />} path={"/"} />
          <Route element={<AddTask />} path={`/addtask`} />
          <Route element={<AddTask />} path={`/edittask/:id`} />
          <Route element={<Tasks />} path={"/tasks"} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
