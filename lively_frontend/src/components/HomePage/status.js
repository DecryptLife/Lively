import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";

const Status = ({ handleLogout, goToProfile }) => {
  const url = (path) => `${BASE_URL}${path}`;

  const [avatar, setAvatar] = useState("");
  const [status, setUStatus] = useState("");
  const [modStatus, setModStatus] = useState("");

  useEffect(() => {
    async function getAvatar() {
      const response = await axios.get(url("/avatar"));

      setAvatar(response.data.avatar);
    }

    getAvatar();
  });

  useEffect(() => {
    async function getHeadline() {
      const response = await axios.get(url("/headline"));
      console.log("Response: ", response);

      setModStatus(response.data.headline);
    }

    getHeadline();
  }, [status]);

  const req = [
    require("../../images/img1.png"),
    require("../../images/img2.png"),
    require("../../images/img3.png"),
    require("../../images/img4.png"),
    require("../../images/img5.png"),
    require("../../images/img6.png"),
    require("../../images/img7.png"),
    require("../../images/img8.png"),
    require("../../images/img9.png"),
    require("../../images/img10.png"),
  ];

  const updateStatus = async (e) => {
    if (status !== "") {
      let new_status = { headline: status };

      const response = await axios.put(url("/headline"), new_status);

      setModStatus(response.data.headline);
      setUStatus("");
    }
  };

  return (
    <div className="home_profile">
      <img
        className="homeImg"
        id="user_image"
        alt="profile pic"
        src={avatar !== "" ? avatar : req[1]}
      ></img>
      <br></br>
      <span className="statusUsername">{}</span>
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

      {/* <div className="btnContainer">
        <button className="logoutBtn" onClick={() => handleLogout()}>
          Logout
        </button>
        <button className="profileBtn" onClick={() => goToProfile()}>
          Profile
        </button>
      </div> */}
    </div>
  );
};

export default Status;
