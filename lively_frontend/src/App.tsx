import "./App.css";
import Layout from "./components/Layout/Layout";
import Login from "./components/LoginPage/Login";
import Home from "./components/HomePage/home";
import Register from "./components/RegistrationPage/registration";
import Profile from "./components/ProfilePage/profile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MissingPage from "./components/MissingPage";
import ProtectedRoutes from "./components/ProtectedRoutes";
// import useAxiosInterceptors from "./utils/useAxiosInterceptor";

function App() {
  // useAxiosInterceptors();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route
            path="/*"
            element={<MissingPage route={"/home"} displayText={"homepage"} />}
          ></Route>
        </Route>
        <Route
          path="/*"
          element={<MissingPage route={"/"} displayText={"login"} />}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
