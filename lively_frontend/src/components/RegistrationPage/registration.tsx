import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./registration.css";
import { registerUser } from "../../API/registrationAPI";

const Register = () => {
  const navigate = useNavigate();

  const [registration, setRegistration] = useState<IRegistration<string>>({
    username: "",
    email: "",
    mobile: "",
    dob: "",
    pincode: "",
    password: "",
    confirmPassword: "",
  });

  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(true);
  const [date, setDate] = useState("");

  const [registrationError, setRegistrationError] = useState<
    IRegistration<boolean>
  >({
    username: false,
    email: false,
    mobile: false,
    dob: false,
    pincode: false,
    password: false,
    confirmPassword: false,
  });

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

    unmError = registration.username === "";
    emError = !email_re.test(registration.email);
    mbError = !mob_re.test(registration.mobile);
    zpError = !zip_re.test(registration.pincode);
    pwdError = !pwd_re.test(registration.password);

    if (unmError || emError || mbError || zpError || unmError || pwdError)
      formValidated = false;
    else formValidated = true;

    setRegistrationError({
      username: unmError,
      email: emError,
      mobile: mbError,
      pincode: zpError,
      password: pwdError,
    });

    if (formValidated && isPasswordMatch) handleRegisterUser();
  };

  const handleRegisterUser = async () => {
    try {
      await registerUser(registration);

      handleNavigateToLogin();
    } catch (err: unknown) {
      if (err instanceof Error)
        console.log("Registration error: " + err.message);
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    setRegistration((prev: IRegistration<string>) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (
      registration.password !== "" &&
      registration.password === registration.confirmPassword
    ) {
      setIsPasswordMatch(true);
    } else {
      setIsPasswordMatch(false);
    }
  }, [registration.confirmPassword]);

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
            name="username"
            value={registration.username}
            onChange={handleInputChange}
          />
          {registrationError.username && (
            <span className="redText">Username can't be empty</span>
          )}

          <input
            className="reg_input"
            type="text"
            placeholder="Email"
            name="email"
            value={registration.email}
            onChange={handleInputChange}
          />
          {registrationError.email && (
            <span className="redText">Not a valid email-id</span>
          )}

          <input
            className="reg_input"
            type="text"
            placeholder="Mobile no (XXX-XXX-XXXX)"
            value={registration.mobile}
            onChange={handleInputChange}
          />
          {registrationError.mobile && (
            <span className="redText">Not a valid number</span>
          )}

          <input
            type="number"
            className="reg_input"
            placeholder="Pincode (XXXXX)"
            value={registration.pincode}
            onChange={handleInputChange}
          />
          {registrationError.pincode && (
            <span className="redText">Not a valid zip-code</span>
          )}

          <input
            type="date"
            className="reg_input"
            value={registration.dob}
            onChange={handleInputChange}
          />
          <input
            type="password"
            className="reg_input"
            placeholder="Password(Minimum 6 and no special characters)"
            value={registration.password}
            onChange={handleInputChange}
          />
          <input
            type="password"
            className="confirmPassIp"
            placeholder="Confirm password"
            value={registration.confirmPassword}
            onChange={handleInputChange}
          />

          {isPasswordMatch && <span className="greenText">Passwords matc</span>}
          {registrationError.password && (
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
        <button onClick={handleNavigateToLogin}>
          Already signed up? Login here
        </button>
      </div>
    </div>
  );
};

export default Register;
