import { useState } from "react";
import LoginField from "./LoginField";
import { useNavigate } from "react-router-dom";
import "./login.css";
import axios from "axios";
import { BASE_URL } from "../../config";

const Login = () => {
  const url = (path) => `${BASE_URL}${path}`;
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [loginError, setLoginError] = useState(false);

  const handleSubmit = async (e, uname, pwd) => {
    e.preventDefault();
    setLoginError(false);
    let userDetails = {
      username: uname,
      password: pwd,
    };

    const response = await axios.post(url("/login"), userDetails, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    localStorage.setItem("cookie", JSON.stringify(response.data.cookie));
    localStorage.setItem("currUser", JSON.stringify(response.data));
    if (response.data.result === "success") {
      navigate("/home");
    } else {
      setErrorMessage(response.data.result);
      setLoginError(true);
    }
  };

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-layout">
      <h1>Welcome to Lively.!</h1>
      <div className="login-container">
        {/* <h2>Login</h2> */}
        <LoginField handleSubmit={handleSubmit} />
        {loginError && <span className="redText">{errorMessage}</span>}
      </div>
      <button className="signup-btn" onClick={handleNavigateToRegister}>
        Sign Up Now
      </button>
    </div>
  );
};

export default Login;
