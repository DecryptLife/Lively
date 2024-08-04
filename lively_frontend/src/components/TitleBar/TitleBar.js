import "./titlebar.css";
import "../../styles/styles.css";
import { useNavigate } from "react-router-dom";

const TitleBar = () => {
  const navigate = useNavigate("");

  const handleNavigation = (page) => {
    switch (page) {
      case "profile":
        navigate("/profile");
        break;
      default:
        console.log("no page");
    }
  };
  return (
    <div className="title_container">
      <div className="flex-center title_container__left">
        {/* Home */}
        <div className="titlebar_item">
          <span>Home</span>
        </div>
        <div
          className="titlebar_item"
          onClick={() => handleNavigation("profile")}
        >
          <span>Profile</span>
        </div>

        {/* Profile */}
      </div>
      <div className="flex-center title_container__center">
        <h2>Lively</h2>
      </div>
      <div className="flex-center title_container__right">
        {/* Chats */}
        {/* Add Friends */}
        {/* Settings */}
        <div className="titlebar_item">
          <span>Chats</span>
        </div>
        <div className="titlebar_item">
          <span>Friends</span>
        </div>

        <div className="titlebar_item">
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
