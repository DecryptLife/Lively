import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginField from "./LoginField";
import { Component, useState } from "react";
import { configure, shallow, mount } from "enzyme";
import user from "@testing-library/user-event";
import Adapter from "enzyme-adapter-react-16";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "./Login";
import { buildTimeValue } from "@testing-library/user-event/dist/utils";
import login from "surge/lib/middleware/login";
import { all_posts } from "../../posts";
import all_users from "../../users";
import Home from "../Home/home";

const currentUser = {
  id: 2,
  name: "Ervin Howell",
  username: "Antonette",
  email: "Shanna@melissa.tv",
  address: {
    street: "Victor Plains",
    suite: "Suite 879",
    city: "Wisokyburgh",
    zipcode: "90566-7771",
    geo: {
      lat: "-43.9509",
      lng: "-34.4618",
    },
  },
  phone: "010-692-6593 x09125",
  website: "anastasia.net",
  company: {
    name: "Deckow-Crist",
    catchPhrase: "Proactive didactic contingency",
    bs: "synergize scalable supply-chains",
  },
};

describe("Validate Authentication", () => {
  localStorage.setItem("all_users", JSON.stringify(all_users.all_users));
  render(
    <Router>
      <Login />
    </Router>
  );

  const username = screen.getByPlaceholderText("Username");
  const password = screen.getByPlaceholderText("Password");
  const signin = screen.getByRole("button", { name: "Sign in" });

  test("should login a previously registered user", () => {
    localStorage.setItem("loggedIn", false);
    fireEvent.change(username, {
      target: {
        value: "Bret",
      },
    });

    fireEvent.change(password, {
      target: {
        value: "Kulas Light",
      },
    });

    fireEvent.submit(signin);
    const loggedIn = localStorage.getItem("loggedIn");
    expect(loggedIn).toBe("true");
  });

  test("should not log in any invalid user", () => {
    localStorage.setItem("loggedIn", false);
    fireEvent.change(username, {
      target: {
        value: "Benson",
      },
    });

    fireEvent.change(password, {
      target: {
        value: "Bissonnet St",
      },
    });

    fireEvent.submit(signin);
    const loggedIn = localStorage.getItem("loggedIn");
    expect(loggedIn).toBe("false");
  });

  test("should log out a user (login state should be cleared)", () => {
    localStorage.setItem("currUser", JSON.stringify(currentUser));
    localStorage.setItem("all_users", JSON.stringify(all_users.all_users));
    localStorage.setItem("entire_posts", JSON.stringify(all_posts));

    // const posts = JSON.parse(localStorage.getItem("all_posts"));
    localStorage.setItem("cu_id", "1");
    render(
      <Router>
        <Home />
      </Router>
    );

    const logoutBtn = screen.getByRole("button", {
      name: "Logout",
    });

    fireEvent.click(logoutBtn);

    const loggedIn = JSON.parse(localStorage.getItem("loggedIn"));

    expect(loggedIn).toBeFalsy;
  });
  // test("should log out a user (login state should be cleared)", (async) => {});
});

// implement the loggedin localstorage correctly
