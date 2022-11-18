import { useState } from "react";
import { Link } from "react-router-dom";

const LoginField = ({ handleSubmit }) => {
  const [uname, setUname] = useState("");
  const [pwd, setPwd] = useState("");

  return (
    <div className="loginPage">
      <form onSubmit={(e) => handleSubmit(e, uname, pwd)}>
        <br />
        <input
          data-testid="username_field"
          type="text"
          id="unameField"
          className="unameField"
          name="unameField"
          placeholder="Username"
          value={uname}
          onChange={(e) => setUname(e.target.value)}
          required
        />
        <br></br>
        <input
          data-testid="password_field"
          type="password"
          className="passwordField"
          id="passwordField"
          placeholder="Password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          required
        />
        <br></br>
        <button type="submit" className="loginBtn" name="login">
          Sign in
        </button>
      </form>
      {/* <div className="createAccount">
        <Link to="/register">Don't have an account? Sign Up</Link>
      </div> */}
    </div>
  );
};

export default LoginField;
