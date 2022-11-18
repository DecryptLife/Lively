import { useState } from "react";
import AppTitle from "../AppTitle";
import LoginField from "./LoginField";
import { Navigate, Redirect, useNavigate } from "react-router-dom";
import "./login.css";
import { useEffect } from "react";
import useFetch from "../useFetch.js";
const Login = ({ users_json }) => {
  localStorage.setItem("benson", "thomas");
  const [loggedIn, setLoggedIn] = useState(
    JSON.parse(localStorage.getItem("loggedIn"))
  );
  const [uExists, setUExists] = useState(null);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false);

  // const {
  //   error,
  //   isPending,
  //   data: users_json,
  // } = useFetch("https://jsonplaceholder.typicode.com/users");

  // localStorage.setItem("users", JSON.stringify(users_json));

  // localStorage.setItem("length", users_json.length);

  const users = JSON.parse(localStorage.getItem("all_users"));
  // localStorage.setItem("length", users.length);

  const { perror, pisPending, data } = useFetch(
    "https://jsonplaceholder.typicode.com/posts"
  );

  const handleSubmit = (e, uname, pwd) => {
    e.preventDefault();
    console.log("Hey");
    const username = uname;
    const password = pwd;
    if (users) {
      console.log(users);
      users.forEach((user) => {
        if (user["username"] != null) {
          if (
            user["username"] === username &&
            user["address"]["street"] === password
          ) {
            storeValues(user);
            localStorage.setItem("loggedIn", true);
            navigate("/home");
            localStorage.setItem("cu_id", user["id"]);
            setLoginError(false);
            console.log(loginError);
          }
          // else {
          //   localStorage.setItem("loggedIn", false);
          //   setLoginError(true);
          // }
          else {
            console.log(loginError);
            setLoginError(true);
          }
        }
      });
    }
  };

  // const setMyPosts = (currentUser) => {
  //   const posts = JSON.parse(localStorage.getItem("all_posts"));
  //   const id = currentUser["id"];
  //   const myposts = posts.filter(function (post) {
  //     return post.userId === id;
  //   });

  //   console.log("fjodhf ", myposts);
  // };
  const storeValues = (currUser) => {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currUser", JSON.stringify(currUser));
    localStorage.setItem(
      "cu_status",
      JSON.stringify(currUser["company"]["catchPhrase"])
    );
    // setMyPosts(currUser);
  };
  const handleSignUp = () => {
    navigate("/register");
  };

  return (
    <div className="loginLayout">
      <div className="loginLeft">
        <div className="loginLeftContent">
          <h1>Login to Your Account</h1>
          <LoginField handleSubmit={handleSubmit} />
          {loginError && <span className="redText">Invalid credentials</span>}
        </div>
      </div>

      <div className="loginRight">
        <div className="loginRightContent">
          <h2>New here?</h2>
          <p>Sign up and make your life more lively!</p>
          <button className="signUpBtn" onClick={() => handleSignUp()}>
            SignUp
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
