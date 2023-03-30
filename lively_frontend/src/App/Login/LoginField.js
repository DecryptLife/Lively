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

  const GoogleSignIn = () => {
    window.location = "https://selective-field.surge.sh/auth/google";
  };
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

      <div>
        <button onClick={() => GoogleSignIn()}> Sign in with Google</button>
      </div>
    </div>
  );
};

export default LoginField;
