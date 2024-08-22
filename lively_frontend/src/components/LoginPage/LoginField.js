import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../API/loginAPI";

const LoginField = () => {
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e, loginDetails) => {
    e.preventDefault();
    try {
      console.log("Login details: ", loginDetails);
      await loginUser(loginDetails);

      navigate("/home");
    } catch (e) {
      console.log("Login error: ", e.message);
    }
  };

  return (
    <div className="login-fields">
      <form
        className="login-form"
        onSubmit={(e) => handleSubmit(e, loginDetails)}
      >
        <input
          data-testid="username_field"
          type="text"
          id="unameField"
          className="unameField"
          name="unameField"
          placeholder="Username"
          value={loginDetails.username}
          onChange={(e) =>
            setLoginDetails((prev) => ({
              ...prev,
              username: e.target.value,
            }))
          }
          required
        />
        <input
          data-testid="password_field"
          type="password"
          className="passwordField"
          id="passwordField"
          placeholder="Password"
          value={loginDetails.password}
          onChange={(e) =>
            setLoginDetails((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
          required
        />
        <button type="submit" className="login-btn" name="login">
          Sign in
        </button>
      </form>
    </div>
  );
};

export default LoginField;
