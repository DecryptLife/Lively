import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { getHeadline, getAvatar } from "../../API/homeAPI";
import { updateStatus } from "../../API/homeAPI";

const Status = ({ goToProfile }) => {
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
  const url = (path) => `${BASE_URL}${path}`;

  const [avatar, setAvatar] = useState("");
  const [status, setUStatus] = useState("");
  const [modStatus, setModStatus] = useState("");

  useEffect(() => {
    async function fetchAvatar() {
      const response = await getAvatar();

      setAvatar(response);
    }

    fetchAvatar();
  }, []);

  console.log(avatar);

  useEffect(() => {
    async function fetchHeadline() {
      const headline = await getHeadline();
      console.log("Headline: ", headline);

      setModStatus(headline);
    }

    fetchHeadline();
  }, [status]);

  const modifyStatus = async (e) => {
    if (status !== "") {
      let new_status = { headline: status };

      const new_headline = await updateStatus(new_status);
      console.log("Updated headline: ", new_headline);

      setModStatus(new_headline);
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
      <div className="update-status__container">
        <input
          type="text"
          className="update-status__input "
          placeholder="New status"
          onChange={(e) => setUStatus(e.target.value)}
          value={status}
        />
        <button className="update-status__btn" onClick={(e) => modifyStatus(e)}>
          Update
        </button>
      </div>
    </div>
  );
};

export default Status;
