import { useState } from "react";
import LoginField from "./LoginField";
import { useNavigate } from "react-router-dom";
import "./login.css";
const Login = () => {
  const url = (path) => `http://localhost:3001${path}`;
  localStorage.setItem("benson", "thomas");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [loginError, setLoginError] = useState(false);

  const handleSubmit = (e, uname, pwd) => {
    e.preventDefault();
    setLoginError(false);
    let userDetails = {
      username: uname,
      password: pwd,
    };
    fetch(url("/login"), {
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(userDetails),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        localStorage.setItem("cookie", JSON.stringify(res.cookie));
        localStorage.setItem("currUser", JSON.stringify(res));
        if (res.result === "success") {
          navigate("/home");
        } else {
          setErrorMessage(res.result);
          setLoginError(true);
        }
      });
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
          {loginError && <span className="redText">{errorMessage}</span>}
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
