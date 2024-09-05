import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App";
import axios from "axios";

// include credentials in axios globally
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

// TypeScript expects the type of root to be HTMLDivElement | null
const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement); // Use createRoot directly
  root.render(<App />);
}
