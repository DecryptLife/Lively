import "./App.css";
import Layout from "./components/Layout/Layout";
import Login from "./components/LoginPage/Login";
import Home from "./components/HomePage/home";
import Register from "./components/RegistrationPage/registration";
import Profile from "./components/ProfilePage/profile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useAxiosInterceptors from "./utils/useAxiosInterceptor";

function App() {
  useAxiosInterceptors();
  console.log("In APP");
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
