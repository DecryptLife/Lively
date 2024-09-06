import "./titlebar.css";
import "../../styles/styles.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logoutUser } from "../../API/loginAPI";

// export const Settings = () => {
//   return (
//     <div className="settings-container">
//       <ul>
//         <li>Logout</li>
//       </ul>
//     </div>
//   );
// };

const TitleBar = () => {
  const navigate = useNavigate("");

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();

      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleNavigation = (page) => {
    switch (page) {
      case "profile":
        navigate("/profile");
        break;
      case "home":
        navigate("/home");
        break;
      default:
        console.log("no page");
    }
  };
  return (
    <div className="title_container">
      <div className="flex-center title_container__left">
        {/* Home */}
        <div className="titlebar_item" onClick={() => handleNavigation("home")}>
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

        <div className="titlebar_item" onClick={toggleSettings}>
          <span>Settings</span>
        </div>
      </div>
      {isSettingsOpen && (
        <div className="settings-content">
          <a href="">Account Settings</a>
          <a href="#" onClick={handleLogout}>
            Logout
          </a>
        </div>
      )}
    </div>
  );
};

export default TitleBar;
