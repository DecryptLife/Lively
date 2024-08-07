import "./layout.css";
const { useLocation, useNavigate } = require("react-router-dom");
const { default: TitleBar } = require("../TitleBar/TitleBar");

const Layout = ({ children }) => {
  const location = useLocation();
  const hideTitleBar = location.pathname === "/";

  return (
    <div className="layout">
      {!hideTitleBar && <TitleBar />}
      {children}
    </div>
  );
};

export default Layout;
