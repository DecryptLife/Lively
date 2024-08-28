import { useEffect, useState } from "react";
import { getHeadline, getAvatar } from "../../API/homeAPI";
import { updateStatus } from "../../API/homeAPI";
import { memo } from "react";

const Status = memo(() => {
  console.log("status rendered");
  const req = [
    require("../../images/img1.png"),
    require("../../images/img2.png"),
    require("../../images/img3.png"),
    require("../../images/img4.png"),
    require("../../images/img5.png"),
  ];

  const [avatar, setAvatar] = useState("");

  const [headline, setHeadline] = useState("Please add headline!");
  const [updatedHeadline, setUpdatedHeadline] = useState("");

  useEffect(() => {
    async function fetchAvatar() {
      console.log("avatar fetching: status.js");
      const response = await getAvatar();
      setAvatar(response);
    }

    async function fetchHeadline() {
      console.log("headline fetching: status.js");
      const response = await getHeadline();
      setHeadline(response);
    }

    fetchAvatar();
    fetchHeadline();
  }, []);

  const modifyStatus = async (e) => {
    console.log("modifying status: status.js");
    if (updatedHeadline !== "") {
      let new_status = { headline: updatedHeadline };

      const new_headline = await updateStatus(new_status);

      setHeadline(new_headline);
      setUpdatedHeadline("");
    }
  };

  return (
    <div className="home_profile">
      <img
        className="home__profile-img"
        id="user_image"
        alt="profile pic"
        src={avatar !== "" ? avatar : req[1]}
      ></img>
      <br></br>
      <span className="statusUsername">{}</span>
      <br></br>
      <div className="userCatchPhrase">
        <span className="statusStatus">{headline}</span>
      </div>

      <br></br>
      <div className="flex-col update-status__container">
        <input
          type="text"
          className="update-status__input "
          placeholder="New status"
          onChange={(e) => setUpdatedHeadline(e.target.value)}
          value={updatedHeadline}
        />
        <button className="update-status__btn" onClick={(e) => modifyStatus(e)}>
          Update
        </button>
      </div>
    </div>
  );
});

export default Status;
