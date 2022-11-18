import { current } from "@reduxjs/toolkit";
import { useState } from "react";
import defaultImg from "../images/default_img_icon.png";
const Status = ({ handleLogout, goToProfile }) => {
  const currUser = JSON.parse(localStorage.getItem("currUser"));

  let userStatus = currUser["company"]["catchPhrase"];

  const [status, setUStatus] = useState("");

  const [modStatus, setModStatus] = useState(
    JSON.parse(localStorage.getItem("cu_status"))
  );

  const id = currUser["id"];
  var req = [
    require("../images/img1.png"),
    require("../images/img2.png"),
    require("../images/img3.png"),
    require("../images/img4.png"),
    require("../images/img5.png"),
    require("../images/img6.png"),
    require("../images/img7.png"),
    require("../images/img8.png"),
    require("../images/img9.png"),
    require("../images/img10.png"),
  ];

  const updateStatus = (e) => {
    if (status != "") {
      localStorage.setItem("cu_status", JSON.stringify(status.toString()));
      var new_stats = JSON.parse(localStorage.getItem("cu_status"));
      setModStatus(new_stats);
      setUStatus("");
    }
  };

  return (
    <div className="homeProfile">
      <img className="homeImg" src={req[id - 1]}></img>
      <br></br>
      <span className="statusUsername">{currUser["username"]}</span>
      <br></br>
      <div className="userCatchPhrase">
        <span className="statusStatus">{modStatus}</span>
      </div>

      <br></br>
      <div className="newStatusContainer">
        <input
          type="text"
          className="changeStatus"
          placeholder="New status"
          onChange={(e) => setUStatus(e.target.value)}
          value={status}
        />
        <button className="updateStatusBtn" onClick={(e) => updateStatus(e)}>
          Update
        </button>
      </div>

      <div className="btnContainer">
        <button className="logoutBtn" onClick={() => handleLogout()}>
          Logout
        </button>
        <button className="profileBtn" onClick={() => goToProfile()}>
          Profile
        </button>
      </div>
    </div>
  );
};

export default Status;
