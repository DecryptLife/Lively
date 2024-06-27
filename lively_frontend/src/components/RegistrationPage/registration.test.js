import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Register from "./registration";

const newUser = {
  username: "Benson",
  email: "bt22@rice.edu",
  mobile_no: "516-351-1042",
  pin_code: "77005",
  password: "benson",
  confirm_password: "benson",
};

describe("Validating Registered user", () => {
  render(
    <Router>
      <Register />
    </Router>
  );

  const userField = screen.getByPlaceholderText("Username");
  const emailField = screen.getByPlaceholderText("Email");
  const mobileField = screen.getByPlaceholderText("Mobile no (XXX-XXX-XXXX)");
  const pinCodeField = screen.getByPlaceholderText("Pincode (XXXXX)");
  const pwdField = screen.getByPlaceholderText(
    "Password(Minimum 6 and no special characters)"
  );
  const coPwdField = screen.getByPlaceholderText("Confirm password");

  const submitBtn = screen.getByTestId("submit_btn");

  test("Registers a valid new user: ", () => {
    fireEvent.change(userField, {
      target: {
        value: newUser.username,
      },
    });

    fireEvent.change(emailField, {
      target: {
        value: newUser.email,
      },
    });

    fireEvent.change(mobileField, {
      target: {
        value: newUser.mobile_no,
      },
    });

    fireEvent.change(pinCodeField, {
      target: {
        value: newUser.pin_code,
      },
    });

    fireEvent.change(pwdField, {
      target: {
        value: newUser.password,
      },
    });

    fireEvent.change(coPwdField, {
      target: {
        value: newUser.confirm_password,
      },
    });

    fireEvent.submit(submitBtn);

    const loggedIn = JSON.parse(localStorage.getItem("loggedIn"));

    expect(loggedIn).toBeTruthy;
  });
});
