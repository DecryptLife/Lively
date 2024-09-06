import "./App.css";
import Login from "./components/LoginPage/Login";
import Home from "./components/HomePage/home";
import Register from "./components/RegistrationPage/registration";
import Profile from "./components/ProfilePage/profile";
import Layout from "./components/Layout/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
