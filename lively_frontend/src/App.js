import "./App.css";
import React from "react";
import Login from "./Login/Login";
import Home from "./Home/home";
import Register from "./registration/registration";
import Profile from "./Profile/profile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />}></Route>
        <Route exact path="/home" element={<Home />}></Route>
        <Route exact path="/register" element={<Register />}></Route>
        <Route exact path="/profile" element={<Profile />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
