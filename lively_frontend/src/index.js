import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App";
import axios from "axios";

// include credentials in axios globally
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
