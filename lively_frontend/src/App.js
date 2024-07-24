import "./App.css";
import React from "react";
import Login from "./components/LoginPage/Login";
import Home from "./components/HomePage/home";
import Register from "./components/RegistrationPage/registration";
import Profile from "./components/ProfilePage/profile";
import Layout from "./components/Layout/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route exact path="/home" element={<Home />}></Route>
          <Route exact path="/register" element={<Register />}></Route>
          <Route exact path="/profile" element={<Profile />}></Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
