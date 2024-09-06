import { useLocation } from "react-router-dom";
import TitleBar from "../TitleBar/TitleBar";
import "./layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
