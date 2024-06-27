import { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";
const LoginField = ({ handleSubmit }) => {
  const url = (path) => `https://lively-backend30.herokuapp.com/${path}`;

  const [uname, setUname] = useState("");
  const [pwd, setPwd] = useState("");

  const handleLogin = (googleData) => {
    fetch(url("/auth/google"), {
      method: "GET",

      sameSite: "none",
      mode: "no-cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <div className="login-fields">
      <form
        className="login-form"
        onSubmit={(e) => handleSubmit(e, uname, pwd)}
      >
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
        <button type="submit" className="login-btn" name="login">
          Sign in
        </button>
      </form>

      {/* <div>
        <button onClick={() => GoogleSignIn()}> Sign in with Google</button>
      </div> */}
    </div>
  );
};

export default LoginField;
