import AppTitle from "../AppTitle";
import defaultImg from "../images/default_img_icon.png";
import Followers from "../Home/Followers";
import "./profile.css";
import UpdateInfo from "./updateInfo";
import UserInfo from "./userInfo";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const currUser = JSON.parse(localStorage.getItem("currUser"));
  const [user, setUser] = useState(currUser);
  // const currUser = JSON.parse(localStorage.getItem("currUser"));
  const id = currUser["id"];

  const inputref = useRef(null);

  const handleClick = () => {
    inputref.current.click();
  };

  const handleHomeClick = () => {
    navigate("/home");
  };
  const handleChange = (e) => {
    const fileObj = e.target.files && e.target.files[0];

    if (!fileObj) {
      return;
    }

    // console.log("fileObj is", fileObj);

    // 👇️ reset file input
    // e.target.value = null;

    // 👇️ is now empty
    // console.log(e.target.files);

    // 👇️ can still access file object here
    // console.log(fileObj);
    // console.log(fileObj.name);
  };
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

  const handleUpdate = (new_details) => {
    var password = new_details.pwd;
    if (
      new_details.name !== "" ||
      new_details.mobNo !== "" ||
      new_details.zipCode !== "" ||
      new_details.pwd !== "" ||
      new_details.email
    ) {
      setUser((prev) => ({
        ...prev,
        username:
          new_details.name !== "" ? new_details.name : currUser.username,
        email: new_details.email !== "" ? new_details.email : currUser.email,
        phone: new_details.mobNo !== "" ? new_details.mobNo : currUser.phone,

        address: {
          street: password !== "" ? password : currUser.address.street,
          zipcode:
            new_details.zipCode !== ""
              ? new_details.zipCode
              : currUser.address.zipcode,
        },
      }));
    }
  };

  return (
    <div className="profile_page">
      <div className="profile_container1">
        <div className="profileImgLayout">
          <img className="profileImg" src={req[id - 1]}></img>
          <br />
          <span
            className="profileUname"
            data-testid="profile_username"
            value={currUser["username"]}
          >
            {currUser["username"]}
          </span>
          <br />
          <div>
            <input
              style={{ display: "none" }}
              type="file"
              ref={inputref}
              onChange={handleChange}
            ></input>
            <button className="uploadImgBtn" onClick={() => handleClick()}>
              Change image
            </button>
          </div>
          <button className="home_text" onClick={() => handleHomeClick()}>
            Home
          </button>
        </div>
      </div>

      <div className="uInfoLayout">
        <UserInfo currentUser={user} />
        <UpdateInfo handleUpdate={handleUpdate} />
      </div>
    </div>
  );
};

export default Profile;
