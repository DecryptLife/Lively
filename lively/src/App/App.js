import "./App.css";
import LoginField from "./Login/LoginField";
import AppTitle from "./AppTitle";
import React, { useEffect } from "react";
import Login from "./Login/Login";
import Home from "./Home/home";
import Register from "./registration/registration";
import Profile from "./Profile/profile";
import useFetch from "./useFetch";
import {
  BrowserRouter as Router,
  Switch,
  Routes,
  Route,
  Redirect,
} from "react-router-dom";

function App() {
  const {
    error,
    isPending,
    data: users_json,
  } = useFetch("https://jsonplaceholder.typicode.com/users");

  if (users_json) {
    localStorage.setItem("all_users", JSON.stringify(users_json));
  }

  const {
    p_error,
    p_isPending,
    data: posts,
  } = useFetch("https://jsonplaceholder.typicode.com/posts");

  if (posts) {
    localStorage.setItem("entire_posts", JSON.stringify(posts));
  }

  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={<Login users_json={users_json} />}
        ></Route>
        <Route
          exact
          path="/home"
          element={<Home entirePosts={posts} />}
        ></Route>
        <Route exact path="/register" element={<Register />}></Route>
        <Route exact path="/profile" element={<Profile />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
