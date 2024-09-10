import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../API/loginAPI";

interface LoginDetails {
  username: string;
  password: string;
}

const LoginField = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    loginDetails: LoginDetails
  ) => {
    e.preventDefault();
    try {
      await loginUser(loginDetails);

      navigate("/home");
    } catch (e: unknown) {
      if (e instanceof Error) console.log("Login error: ", e.message);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
          ref={inputRef}
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
