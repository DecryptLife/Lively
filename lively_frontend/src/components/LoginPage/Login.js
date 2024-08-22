import { useState } from "react";
import LoginField from "./LoginField";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-layout">
      <h1>Welcome to Lively.!</h1>
      <div className="login-container">
        <h2>Login</h2>
        <LoginField />
        {loginError && <span className="redText">{errorMessage}</span>}
      </div>
      <button className="signup-btn" onClick={handleNavigateToRegister}>
        Sign Up Now
      </button>
    </div>
  );
};

export default Login;
