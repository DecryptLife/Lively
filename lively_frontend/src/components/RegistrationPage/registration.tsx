import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./registration.css";
import { BASE_URL } from "../../config";

const Register = () => {
  const navigate = useNavigate();
  const [uname, setUname] = useState("");
  const [email, setEmail] = useState("");
  const [mobNo, setMobNo] = useState("");
  const [pincode, setPinCode] = useState("");
  const [pwd, setPwd] = useState("");
  const [coPwd, setCoPwd] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [pwdMatch, setPwdMatch] = useState(null);
  const [date, setDate] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [mobError, setMobError] = useState(null);
  const [zipError, setZipError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [pwdFormatError, setPwdFormatError] = useState(null);

  const handleValidation = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let emError = false;
    let mbError = false;
    let zpError = false;
    let pwdError = false;
    let unmError = false;
    let formValidated = false;

    const email_re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const mob_re = /[1-9]{1}[0-9]{2}-[0-9]{3}-[0-9]{4}$/;
    const zip_re = /\b\d{5}\b/;
    const pwd_re = /[a-zA-Z0-9]{6}/;

    unmError = uname === "";
    emError = !email_re.test(email);
    mbError = !mob_re.test(mobNo);
    zpError = !zip_re.test(pincode);
    pwdError = !pwd_re.test(pwd);

    unmError ? setUsernameError(true) : setUsernameError(false);
    emError ? setEmailError(true) : setEmailError(false);
    mbError ? setMobError(true) : setMobError(false);
    zpError ? setZipError(true) : setZipError(false);
    pwdError ? setPwdFormatError(true) : setPwdFormatError(false);

    if (unmError || emError || mbError || zpError || unmError || pwdError)
      formValidated = false;
    else formValidated = true;

    if (formValidated && pwdMatch) {
      updateUserDetails();

      let userReg = {
        username: uname,
        email: email,
        mobile: mobNo,
        zipcode: pincode,
        dob: date,
        password: pwd,
      };

      fetch(url("/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userReg),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.result === "success") navigate("/");
        });
      // navigate("/home");
    }
  };

  const postDetails = () => {};

  const saveToStorage = () => {
    var randum = Math.floor(Math.random() * 10) + 1;
    const currUser = {
      username: uname,
      email: email,
      phone: mobNo,
      id: randum,
      company: {
        catchPhrase: "Please add a fun status",
      },
      address: {
        street: coPwd,
        zipcode: pincode,
      },
      new: true,
    };
    localStorage.setItem("currUser", JSON.stringify(currUser));
  };
  const updateUserDetails = () => {
    postDetails();
    saveToStorage();
  };

  const goToSignIn = () => {
    navigate("/");
  };

  const handleNavigateToLogin = () => {
    navigate("/");
  };

  useEffect(() => {
    if (pwd !== "" && pwd === coPwd) {
      setPwdMatch(true);
    } else {
      setPwdMatch(false);
    }
  }, [coPwd]);

  useEffect(() => {
    if (isRegistered) navigate("/home");
  }, [isRegistered]);

  return (
    <div className="registration-layout">
      <div className="registration__form-container">
        <h2>Create Account</h2>
        <form
          className="registration-form"
          method="POST"
          onSubmit={(e) => handleValidation(e)}
        >
          <input
            className="reg_input"
            type="text"
            placeholder="Username"
            value={uname}
            onChange={(e) => setUname(e.target.value)}
          />
          {usernameError && (
            <span className="redText">Username can't be empty</span>
          )}

          <input
            className="reg_input"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <span className="redText">Not a valid email-id</span>}

          <input
            className="reg_input"
            type="text"
            placeholder="Mobile no (XXX-XXX-XXXX)"
            value={mobNo}
            onChange={(e) => setMobNo(e.target.value)}
          />
          {mobError && <span className="redText">Not a valid number</span>}

          <input
            type="number"
            className="reg_input"
            placeholder="Pincode (XXXXX)"
            value={pincode}
            onChange={(e) => setPinCode(e.target.value)}
          />
          {zipError && <span className="redText">Not a valid zip-code</span>}

          <input
            type="date"
            className="reg_input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="password"
            className="reg_input"
            placeholder="Password(Minimum 6 and no special characters)"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
          <input
            type="password"
            className="confirmPassIp"
            placeholder="Confirm password"
            value={coPwd}
            onChange={(e) => setCoPwd(e.target.value)}
          />

          {pwdMatch && <span className="greenText">Passwords matc</span>}
          {pwdFormatError && (
            <span className="redText">Invalid password format</span>
          )}
          <button
            data-testid="submit_btn"
            className="register-btn"
            type="submit"
          >
            Register
          </button>
        </form>
      </div>

      <div className="navigate__to__login-text">
        <span onClick={handleNavigateToLogin}>
          Already signed up? Login here
        </span>
      </div>
    </div>
  );
};

export default Register;
