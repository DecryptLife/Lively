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
  const [uname, setUname] = useState("");
  const [pwd, setPwd] = useState("");

  const handleSubmit = async (e, uname, pwd) => {
    e.preventDefault();
    console.log("In handle submit", uname);
    setLoginError(false);
    let userDetails = {
      username: uname,
      password: pwd,
    };

    console.log(`User details:  ${uname}`);

    const response = await axios
      .post(
        url("/login"),
        { username: uname, password: pwd },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .catch((err) => console.log(err));

    localStorage.setItem("cookie", JSON.stringify(response.data.cookie));
    localStorage.setItem("currUser", JSON.stringify(response.data));

    console.log(response);
    if (response.status === 200) {
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
        <h2>Login</h2>
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
