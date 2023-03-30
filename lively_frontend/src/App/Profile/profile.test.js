import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Profile from "./profile";
import { BrowserRouter as Router } from "react-router-dom";

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

describe("Validate profile actions", () => {
  localStorage.setItem("currUser", JSON.stringify(currentUser));
  render(
    <Router>
      <Profile />
    </Router>
  );

  const profile_username = screen.getByTestId("profile_username").textContent;

  test("should fetch the logged in user's profile username", () => {
    expect(profile_username).toBe(currentUser["username"]);
  });
});
